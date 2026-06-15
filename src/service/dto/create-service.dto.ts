import { IsString, IsOptional, IsUrl, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  employee_id?: number;
}
