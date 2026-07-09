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
    await queryRunner.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area_name text;`);
    
    // Help articles seed
    const articlesCount = await queryRunner.query(`SELECT COUNT(*) FROM help_articles;`);
    if (Number(articlesCount[0]?.count) === 0) {
      await queryRunner.query(`
        INSERT INTO help_articles (title, "titleBn", content, "contentBn", category, views, "createdAt", "updatedAt") VALUES
        (
          'How do I change my booking time?',
          'আমি কীভাবে আমার বুকিংয়ের সময় পরিবর্তন করব?',
          'To change your booking time, navigate to the Bookings section in your client dashboard, find your active booking, and click on "Reschedule". You can choose a new convenient date and time slot. Rescheduling is free of charge up to 4 hours before the service.',
          'আপনার বুকিংয়ের সময় পরিবর্তন করতে, আপনার ক্লায়েন্ট ড্যাশবোর্ডের বুকিং বিভাগে যান, আপনার সক্রিয় বুকিংটি খুঁজুন এবং "সময় পরিবর্তন করুন" এ ক্লিক করুন। আপনি একটি নতুন সুবিধাজনক তারিখ এবং সময় নির্বাচন করতে পারেন। সার্ভিস শুরু হওয়ার ৪ ঘণ্টা পূর্ব পর্যন্ত বিনামূল্যে সময় পরিবর্তন করা যাবে।',
          'Booking & Scheduling',
          42,
          NOW(),
          NOW()
        ),
        (
          'Can I book multiple services at once?',
          'আমি কি একসাথে একাধিক সার্ভিস বুক করতে পারি?',
          'Yes, you can select multiple services and add them to your cart before proceeding to checkout. Our system allows booking different types of services (e.g., AC Repair and Deep Cleaning) in a single request, and we will dispatch the appropriate specialists for each.',
          'হ্যাঁ, আপনি পেমেন্ট করার আগে আপনার কার্টে একাধিক সার্ভিস নির্বাচন করে যোগ করতে পারেন। আমাদের সিস্টেম একটি অনুরোধে বিভিন্ন ধরণের সার্ভিস (যেমন, এসি মেরামত এবং ডিপ ক্লিনিং) বুক করার অনুমতি দেয় এবং আমরা প্রতিটি কাজের জন্য উপযুক্ত বিশেষজ্ঞ পাঠাব।',
          'Booking & Scheduling',
          18,
          NOW(),
          NOW()
        ),
        (
          'When will I get my refund?',
          'আমি কখন আমার রিফান্ড পাব?',
          'Refunds are processed within 3-5 business days from the cancellation approval. The amount will be credited back to your original payment method (BKash, Nagad, or Bank account). You will receive an SMS and email notification once processed.',
          'বুকিং বাতিল অনুমোদনের ৩-৫ কার্যদিবসের মধ্যে রিফান্ড সম্পন্ন করা হয়। টাকাটি আপনার আসল পেমেন্ট মাধ্যমে (বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্ট) ফেরত পাঠানো হবে। রিফান্ড সম্পন্ন হলে আপনি এসএমএস এবং ইমেইল বিজ্ঞপ্তি পাবেন।',
          'Payments & Refund',
          25,
          NOW(),
          NOW()
        ),
        (
          'Which payment methods are accepted?',
          'কোন কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?',
          'We accept all major mobile banking systems (bKash, Nagad, Rocket), Visa/Mastercard debit and credit cards, and Cash on Delivery (COD) for supported home service categories.',
          'আমরা সমস্ত প্রধান মোবাইল ব্যাংকিং ব্যবস্থা (বিকাশ, নগদ, রকেট), ভিসা/মাস্টারকার্ড ডেবিট এবং ক্রেডিট কার্ড এবং সমর্থিত হোম সার্ভিস ক্যাটাগরির জন্য ক্যাশ অন ডেলিভারি (সিওডি) গ্রহণ করি।',
          'Payments & Refund',
          31,
          NOW(),
          NOW()
        ),
        (
          'How we protect your account data?',
          'আমরা কীভাবে আপনার অ্যাকাউন্টের ডেটা সুরক্ষিত রাখি?',
          'We encrypt all personal data and transaction information using industry-standard SSL and secure database hashing. Your payment details are processed securely through certified gateways and are never stored on our servers.',
          'আমরা ইন্ডাস্ট্রি-স্ট্যান্ডার্ড এসএসএল এবং সুরক্ষিত ডাটাবেজ হ্যাশিং ব্যবহার করে সমস্ত ব্যক্তিগত ডেটা এবং লেনদেনের তথ্য এনক্রিপ্ট করি। আপনার পেমেন্ট বিবরণ প্রত্যয়িত গেটওয়ের মাধ্যমে সুরক্ষিতভাবে প্রসেস করা হয় এবং আমাদের সার্ভারে কখনই সংরক্ষণ করা হয় না।',
          'Account & Privacy',
          15,
          NOW(),
          NOW()
        ),
        (
          'Verified service provider badge',
          'যাচাইকৃত সার্ভিস প্রোভাইডার ব্যাজ',
          'Every service professional on Rajseba undergoes strict background checks, including NID verification, address validation, and technical tests. The "Verified" badge on their profile guarantees they have passed our standard vetting.',
          'রাজসেবার প্রতিটি সার্ভিস প্রোভাইডার কঠোর ব্যাকগ্রাউন্ড যাচাইয়ের মধ্য দিয়ে যায়, যার মধ্যে এনআইডি যাচাইকরণ, ঠিকানা যাচাইকরণ এবং প্রযুক্তিগত পরীক্ষা অন্তর্ভুক্ত রয়েছে। তাদের প্রোফাইলে "যাচাইকৃত" ব্যাজ গ্যারান্টি দেয় যে তারা আমাদের মানদণ্ড পূরণ করেছে।',
          'Safety & Trust',
          29,
          NOW(),
          NOW()
        );
      `);
      console.log('Help articles seeded successfully.');
    }
    
    console.log('Database schema patched successfully.');
  } catch (err) {
    console.error('Failed to run database schema patch:', err);
  } finally {
    await queryRunner.release();
  }

  await app.listen(8000);
}
bootstrap();
