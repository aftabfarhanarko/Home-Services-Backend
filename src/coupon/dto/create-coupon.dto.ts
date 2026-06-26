import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { CouponApplicableTo, CouponDiscountType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(CouponDiscountType)
  discount_type: CouponDiscountType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount_value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_order_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usage_limit?: number;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_until?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(CouponApplicableTo)
  applicable_to?: CouponApplicableTo;

  @IsOptional()
  @IsNumber()
  service_id?: number;

  @IsOptional()
  @IsNumber()
  package_id?: number;
}
