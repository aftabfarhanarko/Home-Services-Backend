import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyBrandingDto } from './create-company-branding.dto';

export class UpdateCompanyBrandingDto extends PartialType(CreateCompanyBrandingDto) {}
