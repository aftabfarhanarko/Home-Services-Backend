import { IsString, IsOptional, IsNotEmpty, IsNumber, IsArray, IsEnum } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsNumber()
  service_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['one_time', 'weekly', 'monthly'])
  package_type?: 'one_time' | 'weekly' | 'monthly';

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  nested_service_ids?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsNumber()
  agent_commission_percentage?: number;

  @IsOptional()
  @IsNumber()
  vendor_commission_percentage?: number;
}
