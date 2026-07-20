import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRequest } from './entities/custom-request.entity';
import { User } from '../users/entities/user.entity';
import { CustomRequestService } from './custom-request.service';
import { CustomRequestController } from './custom-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomRequest, User])],
  controllers: [CustomRequestController],
  providers: [CustomRequestService],
  exports: [CustomRequestService],
})
export class CustomRequestModule {}
