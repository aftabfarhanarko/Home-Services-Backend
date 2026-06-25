import { PartialType } from '@nestjs/swagger';
import { CreateGetwayDto } from './create-getway.dto';

export class UpdateGetwayDto extends PartialType(CreateGetwayDto) {}
