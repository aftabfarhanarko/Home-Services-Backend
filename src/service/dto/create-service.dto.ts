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
  @IsString()
  overview?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsArray()
  faq?: { question: string; answer: string }[];

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

  @IsOptional()
  @IsNumber()
  vendor_id?: number;

  @IsOptional()
  @IsNumber()
  agent_commission_percentage?: number;
}
