import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TwilioService } from '../twilio/twilio.service';
import { AiService } from '../ai/ai.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CallStatus, CallDirection } from '@prisma/client';

interface OutboundCallJob {
  callId: string;
  customerId: string;
  campaignId: string;
}

interface CallStatusUpdateJob {
  callId: string;
  status: CallStatus;
  twilioData?: any;
}

@Processor('calls')
export class CallsProcessor {
  private readonly logger = new Logger(CallsProcessor.name);

  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
    private aiService: AiService,
    private websocketGateway: WebsocketGateway,
  ) {}

  /**
   * Process outbound call job
   */
  @Process('outbound-call')
  async handleOutboundCall(job: Job<OutboundCallJob>) {
    const { callId, customerId, campaignId } = job.data;
    this.logger.log(`Processing outbound call job for call ${callId}`);

    try {
      // Get call, customer, and campaign details
      const [call, customer, campaign] = await Promise.all([
        this.prisma.call.findUnique({ where: { id: callId } }),
        this.prisma.customer.findUnique({ where: { id: customerId } }),
        this.prisma.campaign.findUnique({ where: { id: campaignId } }),
      ]);

      if (!call || !customer || !campaign) {
        throw new Error('Call, customer, or campaign not found');
      }

      // Update call status to ringing
      await this.prisma.call.update({
        where: { id: callId },
        data: { status: CallStatus.RINGING },
      });

      // Emit WebSocket event
      this.websocketGateway.emitCallUpdated({
        id: callId,
        status: CallStatus.RINGING,
        customer: { name: customer.name, phone: customer.phone },
      });

      // Generate callback URL for Twilio
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      const callbackUrl = `${baseUrl}/api/calls/webhook/${callId}`;

      // Initiate call via Twilio
      const twilioCall = await this.twilioService.makeCall(
        customer.phone,
        callbackUrl,
      );

      // Update call with Twilio SID
      await this.prisma.call.update({
        where: { id: callId },
        data: {
          twilioSid: twilioCall.sid,
          startedAt: new Date(),
        },
      });

      // Update campaign statistics
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          callsMade: { increment: 1 },
        },
      });

      // Update campaign customer status
      await this.prisma.campaignCustomer.updateMany({
        where: {
          campaignId,
          customerId,
        },
        data: {
          attempts: { increment: 1 },
          lastCallAt: new Date(),
          status: 'CALLED',
        },
      });

      this.logger.log(`Outbound call ${callId} initiated successfully`);
      
      return {
        success: true,
        callId,
        twilioSid: twilioCall.sid,
      };
    } catch (error) {
      this.logger.error(`Error processing outbound call ${callId}:`, error);

      // Update call status to failed
      await this.prisma.call.update({
        where: { id: callId },
        data: {
          status: CallStatus.FAILED,
          endedAt: new Date(),
        },
      });

      // Update campaign statistics
      if (campaignId) {
        await this.prisma.campaign.update({
          where: { id: campaignId },
          data: {
            callsFailed: { increment: 1 },
          },
        });
      }

      // Emit WebSocket event
      this.websocketGateway.emitCallCompleted({
        id: callId,
        status: CallStatus.FAILED,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Process call status update
   */
  @Process('status-update')
  async handleStatusUpdate(job: Job<CallStatusUpdateJob>) {
    const { callId, status, twilioData } = job.data;
    this.logger.log(`Processing status update for call ${callId}: ${status}`);

    try {
      const call = await this.prisma.call.findUnique({
        where: { id: callId },
        include: { campaign: true, customer: true },
      });

      if (!call) {
        throw new Error(`Call ${callId} not found`);
      }

      const updateData: any = { status };

      if (status === CallStatus.IN_PROGRESS) {
        updateData.answeredAt = new Date();
      } else if (status === CallStatus.COMPLETED) {
        updateData.endedAt = new Date();
        
        if (twilioData?.duration) {
          updateData.duration = parseInt(twilioData.duration);
        }

        // Get recording URL if available
        if (call.twilioSid) {
          try {
            const recordingUrl = await this.twilioService.getRecordingUrl(call.twilioSid);
            if (recordingUrl) {
              updateData.recordingUrl = recordingUrl;
            }
          } catch (error) {
            this.logger.warn(`Could not fetch recording for call ${callId}`);
          }
        }

        // Generate summary from conversation
        if (call.conversationLog && Array.isArray(call.conversationLog)) {
          try {
            const summary = await this.aiService.generateSummary(call.conversationLog as any[]);
            updateData.summary = summary;

            // Analyze sentiment
            const conversationText = (call.conversationLog as any[])
              .map(msg => msg.content)
              .join(' ');
            const sentiment = await this.aiService.analyzeSentiment(conversationText);
            updateData.sentiment = sentiment;
          } catch (error) {
            this.logger.warn(`Could not generate summary for call ${callId}`);
          }
        }

        // Update campaign statistics
        if (call.campaignId) {
          const wasSuccessful = call.outcome === 'APPOINTMENT_BOOKED';
          await this.prisma.campaign.update({
            where: { id: call.campaignId },
            data: wasSuccessful
              ? { callsSuccessful: { increment: 1 } }
              : { callsFailed: { increment: 1 } },
          });
        }
      }

      // Update call
      const updatedCall = await this.prisma.call.update({
        where: { id: callId },
        data: updateData,
        include: { customer: true, campaign: true },
      });

      // Emit WebSocket event
      if (status === CallStatus.COMPLETED) {
        this.websocketGateway.emitCallCompleted(updatedCall);
      } else {
        this.websocketGateway.emitCallUpdated(updatedCall);
      }

      this.logger.log(`Status update for call ${callId} completed`);
      
      return {
        success: true,
        callId,
        status,
      };
    } catch (error) {
      this.logger.error(`Error updating call status ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Process retry for failed calls
   */
  @Process('retry-call')
  async handleRetryCall(job: Job<OutboundCallJob>) {
    const { callId, customerId, campaignId } = job.data;
    this.logger.log(`Processing retry for call ${callId}`);

    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
      }

      const campaignCustomer = await this.prisma.campaignCustomer.findFirst({
        where: {
          campaignId,
          customerId,
        },
      });

      if (!campaignCustomer) {
        throw new Error(`Campaign customer not found`);
      }

      // Check if max attempts reached
      if (campaignCustomer.attempts >= campaign.maxAttempts) {
        this.logger.log(`Max attempts reached for customer ${customerId} in campaign ${campaignId}`);
        
        await this.prisma.campaignCustomer.updateMany({
          where: {
            campaignId,
            customerId,
          },
          data: {
            status: 'FAILED',
          },
        });

        return {
          success: false,
          message: 'Max attempts reached',
        };
      }

      // Create new call record
      const newCall = await this.prisma.call.create({
        data: {
          direction: CallDirection.OUTBOUND,
          status: CallStatus.INITIATED,
          toNumber: (await this.prisma.customer.findUnique({ where: { id: customerId } }))?.phone || '',
          fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
          customerId,
          campaignId,
        },
      });

      // Schedule retry with delay
      const retryDelay = campaign.retryDelay * 60 * 1000; // Convert minutes to milliseconds
      await job.queue.add(
        'outbound-call',
        {
          callId: newCall.id,
          customerId,
          campaignId,
        },
        {
          delay: retryDelay,
        },
      );

      this.logger.log(`Retry scheduled for call ${newCall.id} in ${campaign.retryDelay} minutes`);
      
      return {
        success: true,
        newCallId: newCall.id,
        retryDelay: campaign.retryDelay,
      };
    } catch (error) {
      this.logger.error(`Error retrying call ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Process campaign batch - process multiple calls for a campaign
   */
  @Process('campaign-batch')
  async handleCampaignBatch(job: Job<{ campaignId: string }>) {
    const { campaignId } = job.data;
    this.logger.log(`Processing campaign batch for campaign ${campaignId}`);

    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          customers: {
            where: {
              status: 'PENDING',
            },
            include: {
              customer: true,
            },
            take: 10, // Process 10 at a time
          },
        },
      });

      if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
      }

      if (campaign.status !== 'ACTIVE') {
        this.logger.log(`Campaign ${campaignId} is not active, skipping batch`);
        return { success: false, message: 'Campaign not active' };
      }

      const callsToMake = campaign.customers;

      if (callsToMake.length === 0) {
        this.logger.log(`No pending customers in campaign ${campaignId}`);
        
        // Check if campaign is completed
        const totalCustomers = await this.prisma.campaignCustomer.count({
          where: { campaignId },
        });
        const completedCustomers = await this.prisma.campaignCustomer.count({
          where: {
            campaignId,
            status: { in: ['SUCCESS', 'FAILED'] },
          },
        });

        if (totalCustomers === completedCustomers) {
          await this.prisma.campaign.update({
            where: { id: campaignId },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });
          
          this.websocketGateway.emitCampaignUpdated({
            id: campaignId,
            status: 'COMPLETED',
          });
        }

        return { success: true, processed: 0 };
      }

      // Create call records and queue them
      for (const campaignCustomer of callsToMake) {
        const call = await this.prisma.call.create({
          data: {
            direction: CallDirection.OUTBOUND,
            status: CallStatus.INITIATED,
            toNumber: campaignCustomer.customer.phone,
            fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
            customerId: campaignCustomer.customerId,
            campaignId: campaign.id,
          },
        });

        // Add to queue with stagger to avoid overwhelming system
        const delay = Math.random() * 5000; // Random delay up to 5 seconds
        await (job.queue as any).add(
          'outbound-call',
          {
            callId: call.id,
            customerId: campaignCustomer.customerId,
            campaignId: campaign.id,
          },
          {
            delay: Math.floor(delay),
          },
        );
      }

      this.logger.log(`Queued ${callsToMake.length} calls for campaign ${campaignId}`);

      // Schedule next batch if there are more customers
      const remainingCustomers = await this.prisma.campaignCustomer.count({
        where: {
          campaignId,
          status: 'PENDING',
        },
      });

      if (remainingCustomers > 10) {
        await job.queue.add(
          'campaign-batch',
          { campaignId },
          {
            delay: 30000, // Process next batch in 30 seconds
          },
        );
      }

      return {
        success: true,
        processed: callsToMake.length,
        remaining: remainingCustomers - callsToMake.length,
      };
    } catch (error) {
      this.logger.error(`Error processing campaign batch ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Handle completed jobs
   */
  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} (${job.name}) completed successfully`);
  }

  /**
   * Handle failed jobs
   */
  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} (${job.name}) failed:`, error);

    // Implement retry logic for critical jobs
    if (job.attemptsMade < 3 && job.name === 'outbound-call') {
      this.logger.log(`Retrying job ${job.id}, attempt ${job.attemptsMade + 1}`);
    }
  }
}
