import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestedService } from '../nested-service/entities/nested-service.entity';
import { Package } from '../package/entities/package.entity';
import { SubService } from '../sub-service/entities/sub-service.entity';
import { CouponModule } from '../coupon/coupon.module';
import { SmsModule } from '../sms/sms.module';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, NestedService, Package, SubService]),
    CouponModule,
    SmsModule,
    UsersModule,
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
