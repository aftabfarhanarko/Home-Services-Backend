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
  ) { }

  async create(createNestedServiceDto: CreateNestedServiceDto) {
    const nestedService = this.nestedServiceRepository.create({
      ...createNestedServiceDto,
      service: { id: createNestedServiceDto.service_id },
      subServices: createNestedServiceDto.sub_services ? createNestedServiceDto.sub_services.map(sub => ({
        name: sub.name,
        price: sub.price,
      })) : [],
    });
    return await this.nestedServiceRepository.save(nestedService);
  }

  async findAll(user?: any) {
    if (user?.role === 'Vendor') {
      return await this.nestedServiceRepository.find({
        where: { service: { vendor: { id: user.sub } } },
        relations: { service: { vendor: true }, subServices: true },
      });
    }

    return await this.nestedServiceRepository.find({
      relations: { service: true, subServices: true },
    });
  }

  async findByServiceId(serviceId: number) {
    return await this.nestedServiceRepository.find({
      where: { service: { id: serviceId } },
      relations: { service: true, subServices: true },
    });
  }

  async findOne(id: number) {
    const nestedService = await this.nestedServiceRepository.findOne({
      where: { id },
      relations: { service: true, subServices: true },
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
    if (updateNestedServiceDto.sub_services) {
      nestedService.subServices = updateNestedServiceDto.sub_services.map(sub => ({
        name: sub.name,
        price: sub.price,
      })) as any;
    }
    return await this.nestedServiceRepository.save(nestedService);
  }

  async remove(id: number) {
    const nestedService = await this.findOne(id);
    return await this.nestedServiceRepository.remove(nestedService);
  }
}
