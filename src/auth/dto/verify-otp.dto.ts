import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.match(/^(?:\+88|88)?(\d{11})$/)?.[1] || value)
  @Matches(/^(?:\+88|88)?(\d{11})$/, {
    message: 'Phone number must be exactly 11 digits',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otpCode: string;
}
