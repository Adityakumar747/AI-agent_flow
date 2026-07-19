import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TwilioService } from '../twilio/twilio.service';
import { CallDirection, CallStatus } from '@prisma/client';

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
    @InjectQueue('calls') private callsQueue: Queue,
  ) {}

  async makeOutboundCall(customerId: string, campaignId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const call = await this.prisma.call.create({
      data: {
        direction: CallDirection.OUTBOUND,
        status: CallStatus.INITIATED,
        toNumber: customer.phone,
        fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
        customerId,
        campaignId,
      },
    });

    await this.callsQueue.add('outbound-call', {
      callId: call.id,
      customerId,
      campaignId,
    });

    return call;
  }

  async handleInboundCall(data: any) {
    const customer = await this.prisma.customer.findUnique({
      where: { phone: data.From },
    });

    const call = await this.prisma.call.create({
      data: {
        twilioSid: data.CallSid,
        direction: CallDirection.INBOUND,
        status: CallStatus.IN_PROGRESS,
        fromNumber: data.From,
        toNumber: data.To,
        customerId: customer?.id,
      },
    });

    return call;
  }

  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (filters?.direction) where.direction = filters.direction;
    if (filters?.status) where.status = filters.status;
    if (filters?.campaignId) where.campaignId = filters.campaignId;

    const [calls, total] = await Promise.all([
      this.prisma.call.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          campaign: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.call.count({ where }),
    ]);

    return {
      data: calls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const call = await this.prisma.call.findUnique({
      where: { id },
      include: {
        customer: true,
        campaign: true,
        appointment: true,
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }

    return call;
  }

  async findOneWithCampaign(id: string) {
    const call = await this.prisma.call.findUnique({
      where: { id },
      include: {
        customer: true,
        campaign: {
          include: { customers: true },
        },
        appointment: true,
      },
    });

    if (!call) {
      throw new NotFoundException(`Call with ID ${id} not found`);
    }

    return call;
  }

  async updateCallStatus(id: string, status: CallStatus, data?: any) {
    return this.prisma.call.update({
      where: { id },
      data: {
        status,
        ...data,
      },
    });
  }

  async endCall(id: string, data: any) {
    return this.prisma.call.update({
      where: { id },
      data: {
        status: CallStatus.COMPLETED,
        endedAt: new Date(),
        duration: data.duration,
        recordingUrl: data.recordingUrl,
        transcription: data.transcription,
        outcome: data.outcome,
      },
    });
  }
}
