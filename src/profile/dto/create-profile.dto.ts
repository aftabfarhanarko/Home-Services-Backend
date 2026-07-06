import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
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
  picture?: string;

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
  @IsString()
  shop_image1?: string;

  @IsOptional()
  @IsString()
  shop_image2?: string;

  @IsOptional()
  @IsString()
  nid_number?: string;

  @IsOptional()
  @IsString()
  nid_front?: string;

  @IsOptional()
  @IsString()
  nid_back?: string;
  
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  category_ids?: number[];

  @IsOptional()
  @IsNumber()
  devision_id?: number;

  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsOptional()
  @IsNumber()
  area_id?: number;

  @IsOptional()
  @IsString()
  area_name?: string;
}
