import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Booking } from '../booking/entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Withdraw } from '../withdraw/entities/withdraw.entity';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../category/entities/category.entity';
import { Review } from '../review/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Withdraw, Role, Category, Review])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
