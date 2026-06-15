import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNestedServiceDto } from './dto/create-nested-service.dto';
import { UpdateNestedServiceDto } from './dto/update-nested-service.dto';
import { NestedService } from './entities/nested-service.entity';

@Injectable()
export class NestedServiceService {
  constructor(
    @InjectRepository(NestedService)
    private readonly nestedServiceRepository: Repository<NestedService>,
  ) {}

  async create(createNestedServiceDto: CreateNestedServiceDto, vendorId: number) {
    const nestedService = this.nestedServiceRepository.create({
      ...createNestedServiceDto,
      service: { id: createNestedServiceDto.service_id },
      vendor: { id: vendorId },
    });
    return await this.nestedServiceRepository.save(nestedService);
  }

  async findAll() {
    return await this.nestedServiceRepository.find({
      relations: { service: true, vendor: true },
    });
  }

  async findByServiceId(serviceId: number) {
    return await this.nestedServiceRepository.find({
      where: { service: { id: serviceId } },
      relations: { vendor: true },
    });
  }

  async findOne(id: number) {
    const nestedService = await this.nestedServiceRepository.findOne({
      where: { id },
      relations: { service: true, vendor: true },
    });
    if (!nestedService) {
      throw new NotFoundException(`Nested Service with ID ${id} not found`);
    }
    return nestedService;
  }

  async update(id: number, updateNestedServiceDto: UpdateNestedServiceDto) {
    const nestedService = await this.findOne(id);
    if (updateNestedServiceDto.service_id) {
        nestedService.service = { id: updateNestedServiceDto.service_id } as any;
    }
    Object.assign(nestedService, updateNestedServiceDto);
    return await this.nestedServiceRepository.save(nestedService);
  }

  async remove(id: number) {
    const nestedService = await this.findOne(id);
    return await this.nestedServiceRepository.remove(nestedService);
  }
}
