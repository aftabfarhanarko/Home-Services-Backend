import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWithdrawDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
