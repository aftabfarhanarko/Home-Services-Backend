import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDistrictDto {
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
  devision_id: number;
}
