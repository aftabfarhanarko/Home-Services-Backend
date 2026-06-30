import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Security Headers
  app.use(helmet());

  // Enable Compression (Gzip) for faster API responses
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://rajseba-phi.vercel.app', 'https://rajsheba.jevxo.com', 'https://www.rajseba.com'],
    credentials: true,
  });

  // Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable Global Exception Filter for professional formatting
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger for Hoppscotch / API docs
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(8000);
}
bootstrap();
