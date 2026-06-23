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

  async create(createNestedServiceDto: CreateNestedServiceDto) {
    const nestedService = this.nestedServiceRepository.create({
      ...createNestedServiceDto,
      service: { id: createNestedServiceDto.service_id },
    });
    return await this.nestedServiceRepository.save(nestedService);
  }

  async findAll() {
    try {
      return await this.nestedServiceRepository.find({
        relations: { service: true },
      });
    } catch (error) {
      console.error("Database query failed for findAll nested-services:", error);
      return [];
    }
  }

  async findByServiceId(serviceId: number) {
    try {
      return await this.nestedServiceRepository.find({
        where: { service: { id: serviceId } },
        relations: { service: true },
      });
    } catch (error) {
      console.error(`Database query failed for findByServiceId(${serviceId}) nested-services:`, error);
      return [];
    }
  }

  async findOne(id: number) {
    try {
      const nestedService = await this.nestedServiceRepository.findOne({
        where: { id },
        relations: { service: true },
      });
      if (!nestedService) {
        throw new NotFoundException(`Nested Service with ID ${id} not found`);
      }
      return nestedService;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(`Database query failed for findOne(${id}) nested-services:`, error);
      throw new NotFoundException(`Nested Service with ID ${id} not found due to database error`);
    }
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
