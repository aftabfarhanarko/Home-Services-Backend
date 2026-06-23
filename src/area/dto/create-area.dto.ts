import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  banglaName?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsNotEmpty()
  @IsNumber()
  district_id: number;
}
