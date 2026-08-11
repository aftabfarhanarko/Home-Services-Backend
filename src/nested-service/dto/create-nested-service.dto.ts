import {
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubServiceItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  is_contact_for_price?: boolean;

  @IsOptional()
  @IsNumber()
  agent_commission_percentage?: number;

  @IsOptional()
  @IsNumber()
  vendor_commission_percentage?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image1?: string;

  @IsOptional()
  @IsString()
  image2?: string;

  @IsOptional()
  @IsArray()
  faq?: { question: string; answer: string }[];
}

export class CreateNestedServiceDto {
  @IsNotEmpty()
  @IsNumber()
  service_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  starting_price?: number;

  @IsOptional()
  @IsBoolean()
  is_contact_for_price?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubServiceItemDto)
  sub_services?: SubServiceItemDto[];
}
