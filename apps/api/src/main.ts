import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { seedCountry } from 'prisma/seed';
import { AppModule } from './app.module';
import { ZodFilter } from './filters/zod-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useGlobalFilters(new ZodFilter());

  const config = new DocumentBuilder()
    .setTitle('FreeFlow')
    .setDescription('FreeFlow API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  // Database seeding
  seedCountry();

  await app.listen(8080);
}
bootstrap();
