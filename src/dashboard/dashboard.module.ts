import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Booking } from '../booking/entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Withdraw } from '../withdraw/entities/withdraw.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Withdraw, Role])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
