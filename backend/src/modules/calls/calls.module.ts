import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallsProcessor } from './calls.processor';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { TwilioModule } from '../twilio/twilio.module';
import { AiModule } from '../ai/ai.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'calls',
    }),
    PrismaModule,
    TwilioModule,
    AiModule,
    WebsocketModule,
  ],
  controllers: [CallsController],
  providers: [CallsService, CallsProcessor],
  exports: [CallsService],
})
export class CallsModule {}
