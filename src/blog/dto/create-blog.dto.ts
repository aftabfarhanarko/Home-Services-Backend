import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayMaxSize } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  overview?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  @IsOptional()
  images?: string[];
}
