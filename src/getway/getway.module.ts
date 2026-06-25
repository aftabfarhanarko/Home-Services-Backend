import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetwayService } from './getway.service';
import { GetwayController } from './getway.controller';
import { Getway } from './entities/getway.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Getway])],
  controllers: [GetwayController],
  providers: [GetwayService],
  exports: [GetwayService],
})
export class GetwayModule {}
