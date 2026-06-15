import { IsString, IsOptional, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  service_id: number;

  @IsOptional()
  @IsNumber()
  nested_service_id?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
