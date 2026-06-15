import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { SmsModule } from './sms/sms.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { PackageModule } from './package/package.module';
import { BookingModule } from './booking/booking.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { NestedServiceModule } from './nested-service/nested-service.module';
import { ReviewModule } from './review/review.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // Use only in dev. In prod use migrations.
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UsersModule,
    AuthModule,
    RolesModule,
    SmsModule,
    CategoryModule,
    ServiceModule,
    PackageModule,
    BookingModule,
    WithdrawModule,
    NestedServiceModule,
    ReviewModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
