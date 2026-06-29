import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
