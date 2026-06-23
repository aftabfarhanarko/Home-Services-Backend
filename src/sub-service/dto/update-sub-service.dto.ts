import { PartialType } from '@nestjs/mapped-types';
import { CreateSubServiceDto } from './create-sub-service.dto';

export class UpdateSubServiceDto extends PartialType(CreateSubServiceDto) {}
