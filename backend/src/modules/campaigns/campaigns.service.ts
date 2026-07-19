import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TwilioService } from '../twilio/twilio.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus, CallStatus, CallDirection } from '@prisma/client';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
    @InjectQueue('calls') private callsQueue: Queue,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, userId: string) {
    try {
      const { customerIds, ...campaignData } = createCampaignDto;

      const campaign = await this.prisma.campaign.create({
        data: {
          ...campaignData,
          createdById: userId,
          totalCustomers: customerIds?.length || 0,
          ...(customerIds && customerIds.length > 0 ? {
            customers: {
              create: customerIds.map((customerId) => ({
                customerId,
              })),
            },
          } : {}),
        },
        include: {
          customers: {
            include: {
              customer: true,
            },
          },
        },
      });

      return campaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to create campaign',
        message: error.message || 'Unknown database error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(page: number = 1, limit: number = 20, userId?: string) {
    const skip = (page - 1) * limit;
    const where = userId ? { createdById: userId } : {};

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { customers: true, calls: true },
          },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return {
      data: campaigns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customers: {
          include: {
            customer: true,
          },
        },
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    await this.findOne(id);

    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.campaign.delete({
      where: { id },
    });

    return { message: 'Campaign deleted successfully' };
  }

  async startCampaign(id: string) {
    const campaign = await this.findOne(id);

    if (campaign.status === CampaignStatus.ACTIVE) {
      return { message: 'Campaign is already active' };
    }

    // Update campaign status
    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.ACTIVE,
        startedAt: new Date(),
      },
      include: {
        customers: {
          include: { customer: true }
        }
      }
    });

    // PROCESS SYNCHRONOUSLY FOR LOCAL TESTING (Bypass Redis Queue)
    try {
      const callsToMake = updatedCampaign.customers.filter(c => c.status === 'PENDING');
      
      for (const campaignCustomer of callsToMake) {
        // Create call record
        const call = await this.prisma.call.create({
          data: {
            direction: CallDirection.OUTBOUND,
            status: CallStatus.RINGING,
            toNumber: campaignCustomer.customer.phone,
            fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
            customerId: campaignCustomer.customerId,
            campaignId: id,
          },
        });

        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        const callbackUrl = `${baseUrl}/api/calls/webhook/${call.id}`;

        // Direct Twilio call
        const twilioCall = await this.twilioService.makeCall(
          campaignCustomer.customer.phone,
          callbackUrl,
        );

        // Update call with Twilio SID
        await this.prisma.call.update({
          where: { id: call.id },
          data: {
            twilioSid: twilioCall.sid,
            startedAt: new Date(),
          },
        });

        // Update campaign stats
        await this.prisma.campaign.update({
          where: { id },
          data: { callsMade: { increment: 1 } },
        });

        await this.prisma.campaignCustomer.updateMany({
          where: { campaignId: id, customerId: campaignCustomer.customerId },
          data: { attempts: { increment: 1 }, lastCallAt: new Date(), status: 'CALLED' },
        });
      }
    } catch (error) {
      this.logger.error('Error starting campaign calls:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to place call via Twilio',
        message: error.message || 'Check if Twilio Trial allows calling this number, and if Twilio credentials are valid.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return updatedCampaign;
  }

  async pauseCampaign(id: string) {
    await this.findOne(id);

    return this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.PAUSED,
      },
    });
  }
}
