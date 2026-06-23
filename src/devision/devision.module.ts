import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevisionService } from './devision.service';
import { DevisionController } from './devision.controller';
import { Devision } from './entities/devision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Devision])],
  controllers: [DevisionController],
  providers: [DevisionService],
})
export class DevisionModule {}
