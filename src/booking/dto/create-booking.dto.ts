import { IsString, IsOptional, IsNotEmpty, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  vendor_id: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  sub_service_ids?: number[];

  @IsOptional()
  @IsNumber()
  package_id?: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  service_id?: number;
}
