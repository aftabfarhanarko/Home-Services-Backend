import { IsString, IsOptional, IsNotEmpty, IsNumber, IsDateString, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubServiceItemDto {
  @IsNumber()
  sub_service_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  vendor_id: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  sub_service_ids?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubServiceItemDto)
  sub_service_items?: SubServiceItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

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

  @IsOptional()
  @IsString()
  coupon_code?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration_months?: number;
}
