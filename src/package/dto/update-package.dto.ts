import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsOptional()
  @IsEnum(['one_time', 'weekly', 'monthly'])
  package_type?: 'one_time' | 'weekly' | 'monthly';
}
