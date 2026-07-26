import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyBrandingService } from './company-branding.service';
import { CompanyBrandingController } from './company-branding.controller';
import { CompanyBranding } from './entities/company-branding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyBranding])],
  controllers: [CompanyBrandingController],
  providers: [CompanyBrandingService],
  exports: [CompanyBrandingService],
})
export class CompanyBrandingModule {}
