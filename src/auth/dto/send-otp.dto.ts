import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.match(/^(?:\+88|88)?(\d{11})$/)?.[1] || value)
  @Matches(/^(?:\+88|88)?(\d{11})$/, {
    message: 'Phone number must be exactly 11 digits',
  })
  phone: string;
}
