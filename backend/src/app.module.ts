import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Common modules
import { PrismaModule } from './common/prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CallsModule } from './modules/calls/calls.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Bull Queue (Redis)
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD || undefined,
          tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
        },
      }),
    }),

    // Common modules
    PrismaModule,
    LoggerModule,

    // Feature modules
    AuthModule,
    UsersModule,
    CustomersModule,
    CampaignsModule,
    CallsModule,
    AppointmentsModule,
    KnowledgeBaseModule,
    AnalyticsModule,
    AiModule,
    TwilioModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
