import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import OpinionModule from 'public/opinions/opinion.module';
import { seedCountry, seedExpenseCategory } from '../prisma/seed';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization, X-API-KEY',
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  const configInternal = new DocumentBuilder()
    .setTitle('FreeFlow')
    .setDescription('FreeFlow API')
    .setVersion('1.0')
    .build();
  const internalDocument = SwaggerModule.createDocument(app, configInternal);

  SwaggerModule.setup('swagger', app, internalDocument);

  const configPublic = new DocumentBuilder()
    .setTitle('FreeFlow')
    .setDescription('FreeFlow Public API')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API Key for authentication',
      },
      'api-key',
    )
    .build();

  const publicDocument = SwaggerModule.createDocument(app, configPublic, {
    include: [OpinionModule],
  });

  SwaggerModule.setup('public/swagger', app, publicDocument);

  // Database seeding
  seedCountry();
  seedExpenseCategory();

  await app.listen(8080);
}

bootstrap();
