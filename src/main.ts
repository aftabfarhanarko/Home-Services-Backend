import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedServer: any;

export async function bootstrapServer() {
  if (cachedServer) {
    return cachedServer;
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

  // Enable Compression (Gzip level 6) for maximum response speed & low memory overhead
  app.use(compression({ level: 6, threshold: 512 }));

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

  // Enable Global Exception Filter for professional formatting
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger for Hoppscotch / API docs
  const config = new DocumentBuilder()
    .setTitle('Rajseba API')
    .setDescription('Rajseba Backend API Services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.init();
  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

// Local dev listener
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  bootstrapServer().then(() => {
    const port = process.env.PORT || 8000;
    const server = cachedServer;
    if (server && typeof server.listen === 'function') {
      server.listen(port, () => {
        console.log(`Server is running locally on port ${port}`);
      });
    }
  });
}

export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}
