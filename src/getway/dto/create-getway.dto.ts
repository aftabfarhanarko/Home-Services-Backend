import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { GetwayType } from '../entities/getway.entity';

export class CreateGetwayDto {
  @IsNumber()
  userId: number;

  @IsEnum(GetwayType)
  getway_type: GetwayType;

  @IsOptional()
  info: any;
}
