import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
