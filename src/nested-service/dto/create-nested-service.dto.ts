import { IsString, IsOptional, IsUrl, IsNotEmpty, IsNumber } from 'class-validator';

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
  sub_services?: {
    name: string;
    price: number;
    agent_commission_percentage?: number;
    vendor_commission_percentage?: number;
    description?: string;
    image1?: string;
    image2?: string;
    faq?: { question: string; answer: string }[];
  }[];
}
