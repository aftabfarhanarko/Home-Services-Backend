import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchServiceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  devision_id?: number;

  @IsOptional()
  @IsString()
  q?: string;
}
