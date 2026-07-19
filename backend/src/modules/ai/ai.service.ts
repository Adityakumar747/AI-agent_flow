import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy',
    });
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'dummy',
    });
  }

  /**
   * Generate AI response for a conversation
   */
  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    campaignScript?: string,
    businessContext?: string,
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(campaignScript, businessContext);
      const useGroq = process.env.AI_PROVIDER === 'groq';

      if (useGroq) {
        const completion = await this.groq.chat.completions.create({
          model: process.env.GROQ_MODEL || 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({ role: msg.role as any, content: msg.content })),
          ],
          temperature: 0.7,
          max_tokens: 150,
        });
        return completion.choices[0]?.message?.content || 'I apologize, I did not understand that.';
      } else {
        const completion = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({ ...msg, name: undefined } as any)),
          ],
          temperature: 0.7,
          max_tokens: 150,
        });
        return completion.choices[0]?.message?.content || 'I apologize, I did not understand that.';
      }
    } catch (error) {
      this.logger.error('Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using OpenAI TTS
   */
  async textToSpeech(text: string, voice: string = 'alloy'): Promise<Buffer> {
    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: voice as any,
        input: text,
        speed: 1.0,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      this.logger.error('Error converting text to speech:', error);
      throw error;
    }
  }

  /**
   * Convert speech to text using OpenAI Whisper
   */
  async speechToText(audioBuffer: Buffer, filename: string = 'audio.mp3'): Promise<string> {
    try {
      const file = new File([audioBuffer as any], filename, { type: 'audio/mpeg' });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });

      return transcription.text;
    } catch (error) {
      this.logger.error('Error converting speech to text:', error);
      throw error;
    }
  }

  /**
   * Analyze sentiment of conversation
   */
  async analyzeSentiment(text: string): Promise<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analyzer. Respond with only one word: POSITIVE, NEUTRAL, or NEGATIVE.',
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this conversation: "${text}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const sentiment = completion.choices[0]?.message?.content?.trim().toUpperCase();
      
      if (sentiment === 'POSITIVE' || sentiment === 'NEUTRAL' || sentiment === 'NEGATIVE') {
        return sentiment;
      }
      
      return 'NEUTRAL';
    } catch (error) {
      this.logger.error('Error analyzing sentiment:', error);
      return 'NEUTRAL';
    }
  }

  /**
   * Extract key information from conversation (appointment details, callback time, etc.)
   */
  async extractInformation(
    conversationText: string,
    extractionType: 'appointment' | 'callback' | 'general',
  ): Promise<any> {
    try {
      let prompt = '';
      
      if (extractionType === 'appointment') {
        prompt = `Extract appointment details from this conversation. Return JSON with: service, dateTime, duration, location. If not found, return null values.\n\nConversation: "${conversationText}"`;
      } else if (extractionType === 'callback') {
        prompt = `Extract callback request details from this conversation. Return JSON with: requestedTime, reason. If not found, return null values.\n\nConversation: "${conversationText}"`;
      } else {
        prompt = `Summarize the key points from this conversation in JSON format.\n\nConversation: "${conversationText}"`;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an information extraction assistant. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      
      try {
        return response ? JSON.parse(response) : null;
      } catch {
        return null;
      }
    } catch (error) {
      this.logger.error('Error extracting information:', error);
      return null;
    }
  }

  /**
   * Search knowledge base for relevant answers
   */
  async searchKnowledgeBase(query: string): Promise<string | null> {
    try {
      const knowledgeEntries = await this.prisma.knowledgeBase.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          priority: 'desc',
        },
      });

      if (knowledgeEntries.length === 0) {
        return null;
      }

      // Use OpenAI to find the most relevant answer
      const knowledgeContext = knowledgeEntries
        .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
        .join('\n\n');

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant. Use the following knowledge base to answer questions. If the answer is not in the knowledge base, say "I don't have that information."\n\nKnowledge Base:\n${knowledgeContext}`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      this.logger.error('Error searching knowledge base:', error);
      return null;
    }
  }

  /**
   * Generate conversation summary
   */
  async generateSummary(conversationLog: any[]): Promise<string> {
    try {
      const conversationText = conversationLog
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize this conversation in 2-3 sentences. Focus on the outcome and key points.',
          },
          {
            role: 'user',
            content: conversationText,
          },
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || 'Conversation summary unavailable.';
    } catch (error) {
      this.logger.error('Error generating summary:', error);
      return 'Error generating summary.';
    }
  }

  /**
   * Build system prompt for AI agent
   */
  private buildSystemPrompt(campaignScript?: string, businessContext?: string): string {
    const basePrompt = `You are a friendly and professional AI assistant making phone calls on behalf of a business.

Your goal is to have natural, human-like conversations while following the script and achieving the campaign objective.

Guidelines:
- Be warm, friendly, and conversational
- Listen carefully to what the customer says
- Handle objections politely and professionally
- If the customer is busy, offer to call back at a better time
- If the customer has questions you can't answer, say you'll have someone call them back
- Never be pushy or aggressive
- Keep responses concise and natural
- Confirm important details before ending the call`;

    let fullPrompt = basePrompt;

    if (campaignScript) {
      fullPrompt += `\n\nCampaign Script:\n${campaignScript}`;
    }

    if (businessContext) {
      fullPrompt += `\n\nBusiness Context:\n${businessContext}`;
    }

    return fullPrompt;
  }

  /**
   * Handle conversation turn with context awareness
   */
  async handleConversationTurn(
    callId: string,
    userMessage: string,
    campaignScript?: string,
  ): Promise<{ response: string; shouldEndCall: boolean; extractedInfo?: any }> {
    try {
      // Get existing conversation from database
      const call = await this.prisma.call.findUnique({
        where: { id: callId },
        include: {
          campaign: true,
        },
      });

      if (!call) {
        throw new Error('Call not found');
      }

      const conversationLog = (call.conversationLog as any[]) || [];
      
      // Add user message to conversation
      conversationLog.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      });

      // Generate AI response
      const aiResponse = await this.generateResponse(
        conversationLog.map(msg => ({ role: msg.role, content: msg.content })),
        campaignScript || call.campaign?.aiScript,
      );

      // Add AI response to conversation
      conversationLog.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      });

      // Check if call should end
      const shouldEndCall = this.shouldEndCall(userMessage, aiResponse, conversationLog);

      // Extract information if needed
      let extractedInfo = null;
      if (conversationLog.length > 4) {
        const fullConversation = conversationLog
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        
        extractedInfo = await this.extractInformation(fullConversation, 'appointment');
      }

      // Update call in database
      await this.prisma.call.update({
        where: { id: callId },
        data: {
          conversationLog: conversationLog as any,
          aiResponses: { increment: 1 },
        },
      });

      return {
        response: aiResponse,
        shouldEndCall,
        extractedInfo,
      };
    } catch (error) {
      this.logger.error('Error handling conversation turn:', error);
      throw error;
    }
  }

  /**
   * Determine if call should end based on conversation
   */
  private shouldEndCall(userMessage: string, aiResponse: string, conversationLog: any[]): boolean {
    const endPhrases = [
      'goodbye',
      'bye',
      'thank you, bye',
      'talk to you later',
      'have a good day',
      'not interested',
      'don\'t call again',
      'remove me',
    ];

    const userLower = userMessage.toLowerCase();
    const aiLower = aiResponse.toLowerCase();

    // Check if user wants to end
    if (endPhrases.some(phrase => userLower.includes(phrase))) {
      return true;
    }

    // Check if AI is saying goodbye
    if (aiLower.includes('goodbye') || aiLower.includes('have a great day')) {
      return true;
    }

    // End if conversation is too long (more than 20 exchanges)
    if (conversationLog.length > 40) {
      return true;
    }

    return false;
  }
}
