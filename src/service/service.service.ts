import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const serviceData: any = { ...createServiceDto };
    if (createServiceDto.employee_id) {
      serviceData.employee = { id: createServiceDto.employee_id };
    }
    const service = this.serviceRepository.create(serviceData);
    return await this.serviceRepository.save(service);
  }

  async findAll(user: any) {
    if (user?.role === 'Super Admin') {
      return await this.serviceRepository.find({
        relations: { nestedServices: true, packages: true, employee: true },
      });
    }

    return await this.serviceRepository.find({
      where: { employee: { id: user.sub } },
      relations: { nestedServices: true, packages: true, employee: true },
    });
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: { nestedServices: true, packages: true, employee: true },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return await this.serviceRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    return await this.serviceRepository.remove(service);
  }
}
