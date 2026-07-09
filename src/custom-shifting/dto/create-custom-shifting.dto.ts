import { IsString, IsOptional, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateCustomShiftingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  shiftingType: string; // 'home' or 'office'

  @IsNotEmpty()
  @IsString()
  sourceAddress: string;

  @IsNotEmpty()
  @IsString()
  destinationAddress: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsNumber()
  userId?: number;
}
