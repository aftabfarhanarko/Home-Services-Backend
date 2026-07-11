import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 11 ? digits.slice(-11) : value;
  })
  @Matches(/^\d{11}$/, {
    message: 'Phone number must be exactly 11 digits',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otpCode: string;
}
