import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyBrandingDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  // Header / Navbar Logo
  @IsOptional()
  @IsString()
  logoUrl?: string;

  // Footer Logo
  @IsOptional()
  @IsString()
  footerLogoUrl?: string;

  // Single Email Field
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  cityLocation?: string;

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  footerDescription?: string;
}
