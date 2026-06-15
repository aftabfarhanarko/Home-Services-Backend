import { IsString, IsOptional, IsUrl, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNestedServiceDto {
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
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
