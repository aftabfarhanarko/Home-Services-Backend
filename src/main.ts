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
    // Required to prevent serving assets synchronously in serverless without a directory
    const expressAdapter = new (require('@nestjs/platform-express').ExpressAdapter)(server);
    
    appInstance = await NestFactory.create<NestExpressApplication>(
      AppModule,
      expressAdapter,
      { logger: ['error', 'warn', 'log'] }
    );

    // Disable static assets in serverless mode if directory doesn't exist, else wrap it
    try {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (fs.existsSync(uploadsDir)) {
        appInstance.useStaticAssets(uploadsDir, {
          prefix: '/uploads',
        });
      }
    } catch (e) {
      console.warn('Skipping static assets initialization:', e.message);
    }

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
  try {
    await bootstrap();
    server(req, res);
  } catch (error) {
    console.error('Vercel Serverless Function Crash:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Serverless Function Invocation Failed',
      error: error?.message || String(error),
      stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
    });
  }
}
