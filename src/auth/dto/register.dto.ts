import { IsNotEmpty, IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  roleId?: number;
}
