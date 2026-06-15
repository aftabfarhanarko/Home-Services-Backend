import { IsString, IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreatePackageDto {
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
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  nested_service_ids?: number[];
}
