import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

let expressApp: any;

async function createExpressApp() {
  if (expressApp) {
    return expressApp;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Serve static uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Enable Security Headers
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // Enable Compression
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: true,
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

  // Enable Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Rajseba API')
    .setDescription('Rajseba Backend API Services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.init();
  expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

// Local standalone listener
if (!process.env.VERCEL) {
  createExpressApp().then((server) => {
    const port = process.env.PORT || 8000;
    if (typeof server.listen === 'function') {
      server.listen(port, () => {
        console.log(`Server running locally on port ${port}`);
      });
    }
  });
}

// Vercel Serverless Function entrypoint
export default async (req: any, res: any) => {
  try {
    const app = await createExpressApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel Serverless Handler Error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error?.message || String(error),
    });
  }
};
