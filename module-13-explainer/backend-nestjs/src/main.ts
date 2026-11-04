import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend and other microservices
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`🚀 VibeProofLens Module 13 Backend running on Port ${port}`);
  logger.log(`📡 Endpoints:`);
  logger.log(`   - GET  http://localhost:${port}/api/v1/findings`);
  logger.log(`   - GET  http://localhost:${port}/api/v1/findings/:id`);
  logger.log(`   - POST http://localhost:${port}/api/v1/findings/:id/fix`);
  logger.log(`   - POST http://localhost:${port}/api/v1/findings/:id/retest`);
  logger.log(`=======================================================`);
}

bootstrap();

