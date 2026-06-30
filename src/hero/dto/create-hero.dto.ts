import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  subtext?: string;

  @IsOptional()
  @IsString()
  link?: string;
}
