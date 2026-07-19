import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { TwilioModule } from '../twilio/twilio.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'calls',
    }),
    PrismaModule,
    TwilioModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
