import { IsString, IsOptional, IsUrl, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

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
  sub_services?: {
    name: string;
    price: number;
    is_contact_for_price?: boolean;
    agent_commission_percentage?: number;
    vendor_commission_percentage?: number;
    description?: string;
    image1?: string;
    image2?: string;
    faq?: { question: string; answer: string }[];
  }[];
}
