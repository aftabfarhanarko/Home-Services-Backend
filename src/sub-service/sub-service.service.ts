import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubService } from './entities/sub-service.entity';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { UpdateSubServiceDto } from './dto/update-sub-service.dto';

@Injectable()
export class SubServiceService {
  constructor(
    @InjectRepository(SubService)
    private subServiceRepository: Repository<SubService>,
  ) {}

  async create(createSubServiceDto: CreateSubServiceDto): Promise<SubService> {
    const subService = this.subServiceRepository.create({
      ...createSubServiceDto,
      nestedService: { id: createSubServiceDto.nested_service_id },
    });
    return await this.subServiceRepository.save(subService);
  }

  async findAll(): Promise<SubService[]> {
    return await this.subServiceRepository.find({ relations: { nestedService: true } });
  }

  async findOne(id: number): Promise<SubService> {
    const subService = await this.subServiceRepository.findOne({
      where: { id },
      relations: { nestedService: true },
    });
    if (!subService) throw new NotFoundException(`SubService #${id} not found`);
    return subService;
  }

  async update(id: number, updateSubServiceDto: UpdateSubServiceDto): Promise<SubService> {
    const subService = await this.findOne(id);
    if (updateSubServiceDto.name !== undefined) subService.name = updateSubServiceDto.name;
    if (updateSubServiceDto.price !== undefined) subService.price = updateSubServiceDto.price;
    if (updateSubServiceDto.nested_service_id !== undefined) subService.nestedService = { id: updateSubServiceDto.nested_service_id } as any;
    if (updateSubServiceDto.description !== undefined) subService.description = updateSubServiceDto.description;
    if (updateSubServiceDto.image1 !== undefined) subService.image1 = updateSubServiceDto.image1;
    if (updateSubServiceDto.image2 !== undefined) subService.image2 = updateSubServiceDto.image2;
    if (updateSubServiceDto.faq !== undefined) subService.faq = updateSubServiceDto.faq;
    
    return await this.subServiceRepository.save(subService);
  }

  async remove(id: number): Promise<void> {
    const subService = await this.findOne(id);
    await this.subServiceRepository.remove(subService);
  }
}
