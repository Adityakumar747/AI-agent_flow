import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: twilio.Twilio;
  private readonly phoneNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (!accountSid || !authToken || !this.phoneNumber) {
      this.logger.warn('Twilio credentials not configured. Call features will be disabled.');
      return;
    }

    this.client = twilio(accountSid, authToken);
    this.logger.log('✅ Twilio client initialized');
  }

  /**
   * Initiate an outbound call
   */
  async makeCall(toNumber: string, callbackUrl: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const call = await this.client.calls.create({
        to: toNumber,
        from: this.phoneNumber,
        url: callbackUrl,
        statusCallback: `${callbackUrl}/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        record: true,
        recordingStatusCallback: `${callbackUrl}/recording`,
      });

      this.logger.log(`Call initiated to ${toNumber}, SID: ${call.sid}`);
      return call;
    } catch (error) {
      this.logger.error(`Error making call to ${toNumber}:`, error);
      throw error;
    }
  }

  /**
   * Generate TwiML for greeting
   */
  generateGreetingTwiML(greeting: string, gatherUrl: string): string {
    const twiml = new twilio.twiml.VoiceResponse();
    
    const gather = twiml.gather({
      input: ['speech'],
      action: gatherUrl,
      speechTimeout: 'auto',
      language: 'en-US',
    });

    gather.say(greeting);

    // If no input, prompt again
    twiml.say('I didn\'t catch that. Please say something.');
    twiml.redirect(gatherUrl);

    return twiml.toString();
  }

  /**
   * Generate TwiML for AI response
   */
  generateResponseTwiML(response: string, gatherUrl: string, shouldEnd: boolean = false): string {
    const twiml = new twilio.twiml.VoiceResponse();

    if (shouldEnd) {
      twiml.say(response);
      twiml.say('Goodbye!');
      twiml.hangup();
    } else {
      const gather = twiml.gather({
        input: ['speech'],
        action: gatherUrl,
        speechTimeout: 'auto',
        language: 'en-US',
      });

      gather.say(response);

      // If no response, repeat
      twiml.say('Are you still there?');
      twiml.redirect(gatherUrl);
    }

    return twiml.toString();
  }

  /**
   * Generate TwiML to play audio file
   */
  generatePlayAudioTwiML(audioUrl: string, gatherUrl?: string): string {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.play(audioUrl);

    if (gatherUrl) {
      twiml.gather({
        input: ['speech'],
        action: gatherUrl,
        speechTimeout: 'auto',
      });
    }

    return twiml.toString();
  }

  /**
   * Generate TwiML to transfer call to human
   */
  generateTransferTwiML(transferNumber: string): string {
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say('Please hold while I transfer you to a team member.');
    twiml.dial(transferNumber);

    return twiml.toString();
  }

  /**
   * Send SMS message
   */
  async sendSMS(toNumber: string, message: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const sms = await this.client.messages.create({
        to: toNumber,
        from: this.phoneNumber,
        body: message,
      });

      this.logger.log(`SMS sent to ${toNumber}, SID: ${sms.sid}`);
      return sms;
    } catch (error) {
      this.logger.error(`Error sending SMS to ${toNumber}:`, error);
      throw error;
    }
  }

  /**
   * Get call details from Twilio
   */
  async getCallDetails(callSid: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const call = await this.client.calls(callSid).fetch();
      return call;
    } catch (error) {
      this.logger.error(`Error fetching call ${callSid}:`, error);
      throw error;
    }
  }

  /**
   * Get call recording URL
   */
  async getRecordingUrl(callSid: string): Promise<string | null> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const recordings = await this.client.recordings.list({
        callSid: callSid,
        limit: 1,
      });

      if (recordings.length > 0) {
        const recordingUrl = `https://api.twilio.com${recordings[0].uri.replace('.json', '.mp3')}`;
        return recordingUrl;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error fetching recording for call ${callSid}:`, error);
      return null;
    }
  }

  /**
   * Hang up an active call
   */
  async hangupCall(callSid: string): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      await this.client.calls(callSid).update({ status: 'completed' });
      this.logger.log(`Call ${callSid} hung up`);
    } catch (error) {
      this.logger.error(`Error hanging up call ${callSid}:`, error);
      throw error;
    }
  }

  /**
   * Validate Twilio webhook signature
   */
  validateWebhookSignature(signature: string, url: string, params: any): boolean {
    try {
      if (!this.client) {
        return false;
      }

      const authToken = process.env.TWILIO_AUTH_TOKEN;
      return twilio.validateRequest(authToken || '', signature, url, params);
    } catch (error) {
      this.logger.error('Error validating webhook signature:', error);
      return false;
    }
  }

  /**
   * Get list of available phone numbers
   */
  async getAvailableNumbers(countryCode: string = 'US'): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const numbers = await this.client.availablePhoneNumbers(countryCode)
        .local
        .list({ limit: 20 });

      return numbers;
    } catch (error) {
      this.logger.error('Error fetching available numbers:', error);
      throw error;
    }
  }

  /**
   * Purchase a phone number
   */
  async purchaseNumber(phoneNumber: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized');
      }

      const number = await this.client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumber,
      });

      this.logger.log(`Number ${phoneNumber} purchased successfully`);
      return number;
    } catch (error) {
      this.logger.error(`Error purchasing number ${phoneNumber}:`, error);
      throw error;
    }
  }
}
