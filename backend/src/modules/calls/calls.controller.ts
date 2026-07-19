import { Controller, Get, Post, Body, Param, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CallsService } from './calls.service';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TwilioService } from '../twilio/twilio.service';
import { AiService } from '../ai/ai.service';

@Controller('calls')
export class CallsController {
  constructor(
    private readonly callsService: CallsService,
    private readonly twilioService: TwilioService,
    private readonly aiService: AiService,
  ) {}

  // Escape special XML characters to prevent broken TwiML
  private escapeXml(text: string): string {
    return (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('direction') direction: string,
    @Query('status') status: string,
    @Query('campaignId') campaignId: string,
  ) {
    return this.callsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      { direction, status, campaignId },
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(id);
  }

  @Post('make-call')
  @UseGuards(JwtAuthGuard)
  async makeOutboundCall(
    @Body() body: { customerId: string; campaignId: string },
  ) {
    return this.callsService.makeOutboundCall(body.customerId, body.campaignId);
  }

  // Quick test endpoint - call any number directly
  @Post('test-call')
  @UseGuards(JwtAuthGuard)
  async testCall(@Body() body: { toNumber: string }) {
    try {
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      const twimlUrl = `${baseUrl}/api/calls/test-twiml`;
      const result = await this.twilioService.makeCall(body.toNumber, twimlUrl);
      return { success: true, callSid: result.sid, message: `Call initiated to ${body.toNumber}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // TwiML for test call
  @Public()
  @Get('test-twiml')
  testTwiML(@Res() res: Response) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN">Hello! This is a test call from your AI Voice Agent. Your system is working correctly. Goodbye!</Say>
  <Pause length="1"/>
  <Hangup/>
</Response>`;
    res.setHeader('Content-Type', 'text/xml');
    return res.send(twiml);
  }

  /**
   * Twilio webhook for incoming calls
   */
  @Public()
  @Post('webhook/inbound')
  async handleInboundCall(@Body() body: any, @Res() res: Response) {
    try {
      // Create call record
      const call = await this.callsService.handleInboundCall(body);

      // Generate greeting TwiML
      const greeting = 'Hello! Thank you for calling. How can I help you today?';
      const gatherUrl = `${process.env.BACKEND_URL}/api/calls/webhook/gather/${call.id}`;
      const twiml = this.twilioService.generateGreetingTwiML(greeting, gatherUrl);

      res.type('text/xml');
      res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      console.error('Error handling inbound call:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing call');
    }
  }

  /**
   * Twilio webhook for outbound call initiation (called when call is answered)
   */
  @Public()
  @Post('webhook/:callId')
  async handleOutboundCallWebhook(
    @Param('callId') callId: string,
    @Res() res: Response,
  ) {
    try {
      const call = await this.callsService.findOneWithCampaign(callId);

      const rawGreeting = call?.campaign?.aiScript || 'Hello! I am calling from our service center. How can I help you today?';
      const greeting = this.escapeXml(rawGreeting);
      const gatherUrl = `${process.env.BACKEND_URL}/api/calls/speech/${callId}`;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="auto" language="en-IN">
    <Say voice="alice" language="en-IN">${greeting}</Say>
  </Gather>
  <Say voice="alice" language="en-IN">I did not catch that. Please call us back. Goodbye.</Say>
  <Hangup/>
</Response>`;

      res.type('text/xml');
      return res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      console.error('Error in outbound webhook:', error);
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">Sorry, there was a technical error. Goodbye.</Say><Hangup/></Response>`;
      res.type('text/xml');
      return res.status(HttpStatus.OK).send(twiml);
    }
  }

  /**
   * Twilio speech handler - processes user speech and responds with AI
   */
  @Public()
  @Post('speech/:callId')
  async handleSpeech(
    @Param('callId') callId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const gatherUrl = `${process.env.BACKEND_URL}/api/calls/speech/${callId}`;

    try {
      const userSpeech = (body.SpeechResult || body.Digits || '').trim();
      console.log(`[Speech] callId=${callId}, speech="${userSpeech}"`);

      if (!userSpeech) {
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="auto" language="en-IN">
    <Say voice="alice" language="en-IN">I did not hear you. Could you please say that again?</Say>
  </Gather>
  <Hangup/>
</Response>`;
        res.type('text/xml');
        return res.status(HttpStatus.OK).send(twiml);
      }

      const call = await this.callsService.findOneWithCampaign(callId);

      const aiResult = await this.aiService.handleConversationTurn(
        callId,
        userSpeech,
        call.campaign?.aiScript,
      );

      const safeResponse = this.escapeXml(aiResult.response || 'Thank you for your time. Goodbye.');

      let twiml: string;
      if (aiResult.shouldEndCall) {
        twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN">${safeResponse}</Say>
  <Pause length="1"/>
  <Hangup/>
</Response>`;
      } else {
        twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="auto" language="en-IN">
    <Say voice="alice" language="en-IN">${safeResponse}</Say>
  </Gather>
  <Hangup/>
</Response>`;
      }

      res.type('text/xml');
      return res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      console.error('Error in speech handler:', error);
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">I am sorry, I had a technical issue. Goodbye.</Say><Hangup/></Response>`;
      res.type('text/xml');
      return res.status(HttpStatus.OK).send(twiml);
    }
  }

  /**
   * Twilio webhook for call status updates
   */
  @Public()
  @Post('webhook/:callId/status')
  async handleStatusUpdate(
    @Param('callId') callId: string,
    @Body() body: any,
  ) {
    try {
      const status = body.CallStatus;
      
      let callStatus: any = 'INITIATED';
      if (status === 'ringing') callStatus = 'RINGING';
      else if (status === 'in-progress') callStatus = 'IN_PROGRESS';
      else if (status === 'completed') callStatus = 'COMPLETED';
      else if (status === 'busy') callStatus = 'BUSY';
      else if (status === 'no-answer') callStatus = 'NO_ANSWER';
      else if (status === 'failed') callStatus = 'FAILED';

      await this.callsService.updateCallStatus(callId, callStatus, body);

      return { success: true };
    } catch (error) {
      console.error('Error handling status update:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Twilio webhook for recording
   */
  @Public()
  @Post('webhook/:callId/recording')
  async handleRecording(
    @Param('callId') callId: string,
    @Body() body: any,
  ) {
    try {
      await this.callsService.updateCallStatus(callId, 'COMPLETED' as any, {
        recordingUrl: body.RecordingUrl,
      });

      return { success: true };
    } catch (error) {
      console.error('Error handling recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Transfer call to human
   */
  @Public()
  @Post('webhook/:callId/transfer')
  async handleTransfer(
    @Param('callId') callId: string,
    @Res() res: Response,
  ) {
    try {
      const transferNumber = process.env.HUMAN_TRANSFER_NUMBER || '+11234567890';
      const twiml = this.twilioService.generateTransferTwiML(transferNumber);

      await this.callsService.updateCallStatus(callId, 'IN_PROGRESS' as any, {
        outcome: 'TRANSFERRED',
      });

      res.type('text/xml');
      res.status(HttpStatus.OK).send(twiml);
    } catch (error) {
      console.error('Error handling transfer:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error transferring call');
    }
  }
}
