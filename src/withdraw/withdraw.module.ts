import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { Withdraw } from './entities/withdraw.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { SmsModule } from '../sms/sms.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Withdraw, User, Booking]), SmsModule, NotificationModule],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
