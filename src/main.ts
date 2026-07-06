import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
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

  // Run Database Patches to ensure new columns exist in production without migrations
  const dataSource = app.get(DataSource);
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
    
    console.log('Database schema patched successfully.');
  } catch (err) {
    console.error('Failed to run database schema patch:', err);
  } finally {
    await queryRunner.release();
  }

  await app.listen(8000);
}
bootstrap();
