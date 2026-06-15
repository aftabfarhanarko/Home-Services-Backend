import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { Package } from './entities/package.entity';
import { PackageItem } from './entities/package-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageItem])],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
