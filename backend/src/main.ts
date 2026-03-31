import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS: allow origins listed in FRONTEND_URL (comma-separated) plus localhost in non-production.
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  const allowedOrigins = frontendUrl.split(',').map((s) => s.trim());

  const port = configService.get<number>('APP_PORT') || 3000;

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(`http://localhost:${port}`);
  }

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  });

  // All routes are prefixed with /api (e.g. /api/timezones).
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  // Validate and transform all incoming request bodies using class-validator decorators on DTOs.
  // whitelist: strips unknown fields; transform: auto-converts plain objects to DTO class instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger UI is available only in non-production at /api/docs.
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Timezone Harmony API')
      .setDescription('Timezone Harmony backend API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
