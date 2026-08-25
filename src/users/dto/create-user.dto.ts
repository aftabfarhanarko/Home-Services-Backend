import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  vendor_id?: number;

  @IsOptional()
  @IsString()
  vendor_unique_id?: string | null;

  @IsOptional()
  @IsNumber()
  commission_percentage?: number;

  @IsOptional()
  @IsNumber()
  agent_id?: number;
}
