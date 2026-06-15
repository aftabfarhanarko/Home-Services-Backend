import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ProfileType } from '../entities/profile.entity';

export class CreateProfileDto {
  @IsEnum(ProfileType)
  type: ProfileType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsNumber()
  min_starting_price?: number;

  @IsOptional()
  @IsUrl()
  google_map_link?: string;
  
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}
