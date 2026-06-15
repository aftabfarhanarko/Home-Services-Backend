import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestedServiceService } from './nested-service.service';
import { NestedServiceController } from './nested-service.controller';
import { NestedService } from './entities/nested-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NestedService])],
  controllers: [NestedServiceController],
  providers: [NestedServiceService],
})
export class NestedServiceModule {}
