import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  // Get services
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable CORS with more permissive settings for development
  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://ai-agent-flow-lake.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
});

  // Body parser middleware for handling different content types
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  // Special handling for Twilio webhooks (application/x-www-form-urlencoded)
  app.use('/api/calls/webhook*', bodyParser.urlencoded({ extended: true }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }),
  );

  // API documentation endpoint (Swagger can be added later if needed)
  // To add Swagger: npm install @nestjs/swagger swagger-ui-express

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`, 'Bootstrap');
  logger.log(`📚 Environment: ${configService.get('NODE_ENV') || 'development'}`, 'Bootstrap');
  logger.log(`🔌 WebSocket server initialized for real-time updates`, 'Bootstrap');
  logger.log(`📞 Twilio webhooks endpoint: http://localhost:${port}/api/calls/webhook`, 'Bootstrap');
  logger.log(`🎯 Bull queue dashboard available (if installed): http://localhost:${port}/admin/queues`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
