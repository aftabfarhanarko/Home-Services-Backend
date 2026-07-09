import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomShifting } from './entities/custom-shifting.entity';
import { User } from '../users/entities/user.entity';
import { CustomShiftingService } from './custom-shifting.service';
import { CustomShiftingController } from './custom-shifting.controller';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomShifting, User]),
    SmsModule,
  ],
  controllers: [CustomShiftingController],
  providers: [CustomShiftingService],
  exports: [CustomShiftingService],
})
export class CustomShiftingModule {}
