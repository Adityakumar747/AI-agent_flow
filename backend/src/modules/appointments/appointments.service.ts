import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TwilioService } from '../twilio/twilio.service';
import { AppointmentStatus } from '@prisma/client';
import { addMinutes, format, isBefore } from 'date-fns';
import * as XLSX from 'xlsx';

export interface CreateAppointmentDto {
  customerId: string;
  service: string;
  dateTime: Date;
  duration?: number;
  location?: string;
  notes?: string;
  agentId?: string;
}

export interface UpdateAppointmentDto {
  service?: string;
  dateTime?: Date;
  duration?: number;
  location?: string;
  notes?: string;
  status?: AppointmentStatus;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: createAppointmentDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if appointment time is in the future
    if (isBefore(new Date(createAppointmentDto.dateTime), new Date())) {
      throw new BadRequestException('Appointment time must be in the future');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        dateTime: new Date(createAppointmentDto.dateTime),
        status: AppointmentStatus.CONFIRMED,
      },
      include: {
        customer: true,
      },
    });

    // Send confirmation SMS (non-blocking - dummy Twilio creds won't crash the request)
    try {
      await this.sendConfirmationSMS(appointment.id);
    } catch (error) {
      console.error('SMS send failed (non-fatal):', error.message);
    }

    return appointment;
  }

  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.dateFrom && filters?.dateTo) {
      where.dateTime = {
        gte: new Date(filters.dateFrom),
        lte: new Date(filters.dateTo),
      };
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateTime: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        call: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        customer: true,
      },
    });

    return appointment;
  }

  async cancel(id: string, reason?: string) {
    const appointment = await this.findOne(id);

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        notes: reason ? `${appointment.notes || ''}\nCancellation reason: ${reason}` : appointment.notes,
      },
      include: {
        customer: true,
      },
    });

    // Send cancellation SMS
    try {
      await this.twilioService.sendSMS(
        updated.customer.phone,
        `Your appointment for ${updated.service} on ${format(updated.dateTime, 'MMM dd, yyyy at h:mm a')} has been cancelled.`,
      );
    } catch (error) {
      console.error('Error sending cancellation SMS:', error);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Appointment deleted successfully' };
  }

  /**
   * Send confirmation SMS for appointment
   */
  async sendConfirmationSMS(appointmentId: string): Promise<void> {
    const appointment = await this.findOne(appointmentId);

    if (appointment.confirmationSms) {
      return;
    }

    const message = `Appointment confirmed! 
Service: ${appointment.service}
Date: ${format(appointment.dateTime, 'MMMM dd, yyyy')}
Time: ${format(appointment.dateTime, 'h:mm a')}
${appointment.location ? `Location: ${appointment.location}` : ''}

Reply CANCEL to cancel this appointment.`;

    try {
      await this.twilioService.sendSMS(appointment.customer.phone, message);

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          confirmationSms: true,
          confirmationSentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error sending confirmation SMS (non-fatal):', error.message);
      // Don't re-throw - SMS is optional, appointment is created successfully
    }
  }

  /**
   * Send reminder SMS for upcoming appointments
   */
  async sendReminders(): Promise<number> {
    const now = new Date();
    const tomorrow = addMinutes(now, 24 * 60);

    const upcomingAppointments = await this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: now,
          lte: tomorrow,
        },
        status: AppointmentStatus.CONFIRMED,
        reminderSent: false,
      },
      include: {
        customer: true,
      },
    });

    let sentCount = 0;

    for (const appointment of upcomingAppointments) {
      const message = `Reminder: You have an appointment tomorrow!
Service: ${appointment.service}
Time: ${format(appointment.dateTime, 'h:mm a')}
${appointment.location ? `Location: ${appointment.location}` : ''}

Reply CONFIRM to confirm or CANCEL to cancel.`;

      try {
        await this.twilioService.sendSMS(appointment.customer.phone, message);

        await this.prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            reminderSent: true,
            reminderSentAt: new Date(),
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
      }
    }

    return sentCount;
  }

  /**
   * Get appointments for a specific date range
   */
  async getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  /**
   * Get appointment statistics
   */
  async getStatistics() {
    const now = new Date();
    const thirtyDaysAgo = addMinutes(now, -30 * 24 * 60);

    const [total, confirmed, completed, cancelled, noShow, recentAppointments] = await Promise.all([
      this.prisma.appointment.count(),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.CONFIRMED } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.CANCELLED } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.NO_SHOW } }),
      this.prisma.appointment.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ]);

    return {
      total,
      confirmed,
      completed,
      cancelled,
      noShow,
      recentAppointments,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
      noShowRate: total > 0 ? ((noShow / total) * 100).toFixed(2) : 0,
    };
  }

  /**
   * Export all appointments to Excel
   */
  async exportToExcel(): Promise<Buffer> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        customer: { select: { name: true, phone: true, email: true } },
        agent: { select: { name: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const data = appointments.map(a => ({
      CustomerName: a.customer.name,
      CustomerPhone: a.customer.phone,
      CustomerEmail: a.customer.email || '',
      Service: a.service,
      DateTime: format(a.dateTime, 'yyyy-MM-dd HH:mm'),
      Duration: `${a.duration} min`,
      Location: a.location || '',
      Status: a.status,
      Notes: a.notes || '',
      Agent: a.agent?.name || 'AI Agent',
      ReminderSent: a.reminderSent ? 'Yes' : 'No',
      ConfirmationSent: a.confirmationSms ? 'Yes' : 'No',
      CreatedAt: format(a.createdAt, 'yyyy-MM-dd HH:mm'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Check for available time slots
   */
  async getAvailableSlots(date: Date, duration: number = 30) {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // Start at 9 AM

    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0); // End at 6 PM

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    const availableSlots: Date[] = [];
    let currentTime = new Date(startOfDay);

    while (currentTime < endOfDay) {
      const isAvailable = !existingAppointments.some((apt) => {
        const aptEnd = addMinutes(apt.dateTime, apt.duration);
        const slotEnd = addMinutes(currentTime, duration);

        return (
          (currentTime >= apt.dateTime && currentTime < aptEnd) ||
          (slotEnd > apt.dateTime && slotEnd <= aptEnd)
        );
      });

      if (isAvailable) {
        availableSlots.push(new Date(currentTime));
      }

      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return availableSlots;
  }
}
