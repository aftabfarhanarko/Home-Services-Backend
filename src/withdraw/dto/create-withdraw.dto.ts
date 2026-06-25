import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateWithdrawDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsNumber()
  bookingId?: number;

  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @IsNumber()
  gatewayId?: number;
}
