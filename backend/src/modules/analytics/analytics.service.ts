import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CallDirection, CallStatus, AppointmentStatus } from '@prisma/client';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard overview metrics
   */
  async getOverview() {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);
    const yesterday = subDays(now, 1);

    const [
      totalCalls,
      totalCustomers,
      totalCampaigns,
      totalAppointments,
      recentCalls,
      activeCampaigns,
      upcomingAppointments,
      completedCallsToday,
      appointmentsBookedToday,
    ] = await Promise.all([
      this.prisma.call.count(),
      this.prisma.customer.count(),
      this.prisma.campaign.count(),
      this.prisma.appointment.count(),
      this.prisma.call.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      this.prisma.campaign.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      this.prisma.appointment.count({
        where: {
          dateTime: {
            gte: now,
          },
          status: AppointmentStatus.CONFIRMED,
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
          status: CallStatus.COMPLETED,
        },
      }),
      this.prisma.appointment.count({
        where: {
          createdAt: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
        },
      }),
    ]);

    // Calculate conversion rate
    const completedCalls = await this.prisma.call.count({
      where: {
        status: CallStatus.COMPLETED,
      },
    });

    const successfulCalls = await this.prisma.call.count({
      where: {
        outcome: 'APPOINTMENT_BOOKED',
      },
    });

    const conversionRate = completedCalls > 0 
      ? ((successfulCalls / completedCalls) * 100).toFixed(2)
      : 0;

    return {
      totalCalls,
      totalCustomers,
      totalCampaigns,
      totalAppointments,
      recentCalls,
      activeCampaigns,
      upcomingAppointments,
      completedCallsToday,
      appointmentsBookedToday,
      conversionRate,
    };
  }

  /**
   * Get call statistics by date range
   */
  async getCallsByDateRange(startDate: Date, endDate: Date) {
    const calls = await this.prisma.call.groupBy({
      by: ['status', 'direction'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    return calls;
  }

  /**
   * Get call trends by day
   */
  async getCallTrends(days: number = 30) {
    const startDate = subDays(new Date(), days);

    const calls = await this.prisma.call.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
        direction: true,
      },
    });

    // Group by date
    const trendsMap = new Map<string, any>();

    calls.forEach((call) => {
      const date = format(call.createdAt, 'yyyy-MM-dd');
      
      if (!trendsMap.has(date)) {
        trendsMap.set(date, {
          date,
          total: 0,
          inbound: 0,
          outbound: 0,
          completed: 0,
          failed: 0,
        });
      }

      const trend = trendsMap.get(date);
      trend.total++;
      
      if (call.direction === CallDirection.INBOUND) {
        trend.inbound++;
      } else {
        trend.outbound++;
      }

      if (call.status === CallStatus.COMPLETED) {
        trend.completed++;
      } else if (call.status === CallStatus.FAILED || call.status === CallStatus.NO_ANSWER) {
        trend.failed++;
      }
    });

    return Array.from(trendsMap.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
  }

  /**
   * Get conversion metrics
   */
  async getConversionMetrics() {
    const [
      totalCompletedCalls,
      appointmentsBooked,
      callbackRequests,
      noAnswer,
      busy,
      failed,
    ] = await Promise.all([
      this.prisma.call.count({
        where: { status: CallStatus.COMPLETED },
      }),
      this.prisma.call.count({
        where: { outcome: 'APPOINTMENT_BOOKED' },
      }),
      this.prisma.call.count({
        where: { outcome: 'CALLBACK' },
      }),
      this.prisma.call.count({
        where: { status: CallStatus.NO_ANSWER },
      }),
      this.prisma.call.count({
        where: { status: CallStatus.BUSY },
      }),
      this.prisma.call.count({
        where: { status: CallStatus.FAILED },
      }),
    ]);

    return {
      totalCompletedCalls,
      appointmentsBooked,
      callbackRequests,
      noAnswer,
      busy,
      failed,
      conversionRate: totalCompletedCalls > 0 
        ? ((appointmentsBooked / totalCompletedCalls) * 100).toFixed(2)
        : 0,
      contactRate: (totalCompletedCalls + noAnswer + busy + failed) > 0
        ? ((totalCompletedCalls / (totalCompletedCalls + noAnswer + busy + failed)) * 100).toFixed(2)
        : 0,
    };
  }

  /**
   * Get campaign performance
   */
  async getCampaignPerformance() {
    const campaigns = await this.prisma.campaign.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        totalCustomers: true,
        callsMade: true,
        callsSuccessful: true,
        callsFailed: true,
        appointmentsBooked: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return campaigns.map((campaign) => ({
      ...campaign,
      conversionRate: campaign.callsMade > 0
        ? ((campaign.callsSuccessful / campaign.callsMade) * 100).toFixed(2)
        : 0,
      contactRate: campaign.totalCustomers > 0
        ? ((campaign.callsMade / campaign.totalCustomers) * 100).toFixed(2)
        : 0,
    }));
  }

  /**
   * Get average call duration
   */
  async getAverageCallDuration() {
    const calls = await this.prisma.call.findMany({
      where: {
        duration: {
          not: null,
        },
        status: CallStatus.COMPLETED,
      },
      select: {
        duration: true,
      },
    });

    if (calls.length === 0) {
      return { average: 0, total: 0, count: 0 };
    }

    const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    const averageDuration = Math.round(totalDuration / calls.length);

    return {
      average: averageDuration,
      total: totalDuration,
      count: calls.length,
    };
  }

  /**
   * Get sentiment analysis distribution
   */
  async getSentimentDistribution() {
    const sentiments = await this.prisma.call.groupBy({
      by: ['sentiment'],
      where: {
        sentiment: {
          not: null,
        },
      },
      _count: true,
    });

    const total = sentiments.reduce((sum, s) => sum + s._count, 0);

    return sentiments.map((s) => ({
      sentiment: s.sentiment,
      count: s._count,
      percentage: total > 0 ? ((s._count / total) * 100).toFixed(2) : 0,
    }));
  }

  /**
   * Get top performing customers (most appointments)
   */
  async getTopCustomers(limit: number = 10) {
    const customers = await this.prisma.customer.findMany({
      include: {
        _count: {
          select: {
            appointments: true,
            calls: true,
          },
        },
      },
      orderBy: {
        appointments: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return customers;
  }

  /**
   * Get hourly call distribution (peak hours)
   */
  async getHourlyDistribution() {
    const calls = await this.prisma.call.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: 0,
    }));

    calls.forEach((call) => {
      const hour = call.createdAt.getHours();
      hourlyDistribution[hour].count++;
    });

    return hourlyDistribution;
  }

  /**
   * Update daily metrics (run this daily via cron)
   */
  async updateDailyMetrics(date: Date = new Date()) {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const [
      totalCalls,
      inboundCalls,
      outboundCalls,
      completedCalls,
      failedCalls,
      appointmentsBooked,
      callbackRequested,
      transferredToHuman,
    ] = await Promise.all([
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          direction: CallDirection.INBOUND,
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          direction: CallDirection.OUTBOUND,
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: CallStatus.COMPLETED,
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: CallStatus.FAILED,
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          outcome: 'APPOINTMENT_BOOKED',
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          outcome: 'CALLBACK',
        },
      }),
      this.prisma.call.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          outcome: 'TRANSFERRED',
        },
      }),
    ]);

    // Calculate average duration
    const calls = await this.prisma.call.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        duration: { not: null },
      },
      select: {
        duration: true,
      },
    });

    const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    const avgDuration = calls.length > 0 ? totalDuration / calls.length : 0;

    // Upsert metrics
    await this.prisma.callMetric.upsert({
      where: {
        date: startDate,
      },
      update: {
        totalCalls,
        inboundCalls,
        outboundCalls,
        completedCalls,
        failedCalls,
        avgDuration,
        totalDuration,
        appointmentsBooked,
        callbackRequested,
        transferredToHuman,
      },
      create: {
        date: startDate,
        totalCalls,
        inboundCalls,
        outboundCalls,
        completedCalls,
        failedCalls,
        avgDuration,
        totalDuration,
        appointmentsBooked,
        callbackRequested,
        transferredToHuman,
      },
    });

    return { success: true, date: format(date, 'yyyy-MM-dd') };
  }
}
