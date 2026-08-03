import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false;
let appInstance: any;

async function bootstrap() {
  if (!isAppInitialized) {
    appInstance = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new (require('@nestjs/platform-express').ExpressAdapter)(server),
      { logger: ['error', 'warn', 'log'] }
    );

    // Enable Security Headers
    appInstance.use(helmet({ crossOriginResourcePolicy: false }));

    // Enable Compression
    appInstance.use(compression());

    // Enable CORS
    appInstance.enableCors({
      origin: true,
      credentials: true,
    });

    // Enable Global Validation Pipe
    appInstance.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Enable Global Exception Filter
    appInstance.useGlobalFilters(new GlobalExceptionFilter());

    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Rajseba API')
      .setDescription('Rajseba Backend API Services')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(appInstance, config);
    SwaggerModule.setup('api/docs', appInstance, documentFactory);

    await appInstance.init();
    isAppInitialized = true;
  }
  return server;
}

// Local standalone listener
if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server running locally on port ${port}`);
    });
  });
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
