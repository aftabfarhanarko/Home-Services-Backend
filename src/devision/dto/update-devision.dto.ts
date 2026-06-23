import { PartialType } from '@nestjs/swagger';
import { CreateDevisionDto } from './create-devision.dto';

export class UpdateDevisionDto extends PartialType(CreateDevisionDto) {}
