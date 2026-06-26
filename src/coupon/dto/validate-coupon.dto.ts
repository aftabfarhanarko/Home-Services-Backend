import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class ValidateCouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsNumber()
  service_id?: number;

  @IsOptional()
  @IsNumber()
  package_id?: number;
}
