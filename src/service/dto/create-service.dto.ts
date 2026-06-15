import { IsString, IsOptional, IsUrl, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

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
  @IsUrl()
  banner?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  employee_ids?: number[];

  @IsOptional()
  @IsNumber()
  category_id?: number;
}
