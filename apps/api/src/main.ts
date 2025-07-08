import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js web app
      'http://localhost:3001', // Admin panel
      'http://localhost:3002', // Development
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Fixelo API')
      .setDescription('API documentation for Fixelo marketplace')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('services', 'Service management endpoints')
      .addTag('bookings', 'Booking management endpoints')
      .addTag('reviews', 'Review management endpoints')
      .addTag('chat', 'Chat and messaging endpoints')
      .addTag('payments', 'Payment processing endpoints')
      .addTag('plans', 'Subscription plan endpoints')
      .addTag('admin', 'Admin management endpoints')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log('📖 Swagger documentation available at /api/docs');
  }

  const port = configService.get('PORT', 3001);
  
  await app.listen(port);
  
  logger.log(`🚀 Fixelo API is running on: http://localhost:${port}`);
  logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
}); 