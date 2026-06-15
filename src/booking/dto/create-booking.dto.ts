import { IsString, IsOptional, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  vendor_id: number;

  @IsOptional()
  @IsNumber()
  nested_service_id?: number;

  @IsOptional()
  @IsNumber()
  package_id?: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
