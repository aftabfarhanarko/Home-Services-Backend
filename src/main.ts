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

let appInstance: any;

export async function bootstrapServer() {
  if (appInstance) {
    return appInstance;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  // Run Database Patches to ensure new columns exist in production without migrations
  try {
    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      try {
        await queryRunner.query(`ALTER TABLE sub_services ADD COLUMN IF NOT EXISTS description text;`);
        await queryRunner.query(`ALTER TABLE sub_services ADD COLUMN IF NOT EXISTS image1 text;`);
        await queryRunner.query(`ALTER TABLE sub_services ADD COLUMN IF NOT EXISTS image2 text;`);
        await queryRunner.query(`ALTER TABLE sub_services ADD COLUMN IF NOT EXISTS faq jsonb;`);
        
        // Profiles patches
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_image1 text;`);
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_image2 text;`);
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nid_number text;`);
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nid_front text;`);
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nid_back text;`);
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area_name text;`);
      } catch (patchErr) {
        console.error('Database schema patch failed silently:', patchErr);
      } finally {
        await queryRunner.release();
      }
    }
  } catch (err) {
    console.error('Failed to run database schema patch:', err);
  }

  await app.init();
  appInstance = app.getHttpServer();
  return appInstance;
}

// Local dev listener
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  bootstrapServer().then(() => {
    const port = process.env.PORT || 8000;
    appInstance?.listen?.(port);
  });
}

export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}
