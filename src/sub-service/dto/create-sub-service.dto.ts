import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubServiceDto {
  @IsNotEmpty()
  @IsNumber()
  nested_service_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
