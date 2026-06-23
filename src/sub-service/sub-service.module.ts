import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubServiceService } from './sub-service.service';
import { SubServiceController } from './sub-service.controller';
import { SubService } from './entities/sub-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubService])],
  controllers: [SubServiceController],
  providers: [SubServiceService],
  exports: [SubServiceService],
})
export class SubServiceModule {}
