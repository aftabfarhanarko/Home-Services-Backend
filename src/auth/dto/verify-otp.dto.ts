import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:\+88|88)?(01[3-9]\d{8})$/, {
    message: 'Phone number must be a valid Bangladeshi number',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otpCode: string;
}
