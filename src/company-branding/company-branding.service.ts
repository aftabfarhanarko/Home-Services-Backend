import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyBrandingDto } from './dto/create-company-branding.dto';
import { UpdateCompanyBrandingDto } from './dto/update-company-branding.dto';
import { CompanyBranding } from './entities/company-branding.entity';

@Injectable()
export class CompanyBrandingService {
  constructor(
    @InjectRepository(CompanyBranding)
    private readonly brandingRepository: Repository<CompanyBranding>,
  ) {}

  async createOrUpdate(dto: CreateCompanyBrandingDto): Promise<CompanyBranding> {
    const existing = await this.brandingRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });

    if (existing && existing.length > 0) {
      const updated = await this.brandingRepository.preload({
        id: existing[0].id,
        ...dto,
      });
      if (!updated) {
        throw new NotFoundException('Company branding entity not found');
      }
      return this.brandingRepository.save(updated);
    }

    const created = this.brandingRepository.create(dto);
    return this.brandingRepository.save(created);
  }

  async getBranding(): Promise<CompanyBranding> {
    const existing = await this.brandingRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });
    if (!existing || existing.length === 0) {
      return {} as CompanyBranding;
    }
    return existing[0];
  }

  async update(id: number, dto: UpdateCompanyBrandingDto): Promise<CompanyBranding> {
    const branding = await this.brandingRepository.preload({
      id,
      ...dto,
    });
    if (!branding) {
      throw new NotFoundException(`Company branding with ID ${id} not found`);
    }
    return this.brandingRepository.save(branding);
  }
}
