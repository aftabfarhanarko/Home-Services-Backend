import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestedService } from '../nested-service/entities/nested-service.entity';
import { Package } from '../package/entities/package.entity';
import { SubService } from '../sub-service/entities/sub-service.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, NestedService, Package, SubService])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
