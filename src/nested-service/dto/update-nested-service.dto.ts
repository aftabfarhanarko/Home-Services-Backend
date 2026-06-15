import { PartialType } from '@nestjs/mapped-types';
import { CreateNestedServiceDto } from './create-nested-service.dto';

export class UpdateNestedServiceDto extends PartialType(CreateNestedServiceDto) {}
