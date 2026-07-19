import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { TwilioModule } from '../twilio/twilio.module';

@Module({
  imports: [PrismaModule, TwilioModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
