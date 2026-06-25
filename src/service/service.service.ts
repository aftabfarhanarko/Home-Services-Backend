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
    if (createServiceDto.employee_ids) {
      serviceData.employees = createServiceDto.employee_ids.map(id => ({ id }));
      delete serviceData.employee_ids;
    }
    if (createServiceDto.category_id) {
      serviceData.category = { id: createServiceDto.category_id };
      delete serviceData.category_id;
    }
    if (createServiceDto.vendor_id) {
      serviceData.vendor = { id: createServiceDto.vendor_id };
      delete serviceData.vendor_id;
    }
    const service = this.serviceRepository.create(serviceData);
    return await this.serviceRepository.save(service);
  }

  async findAll(user: any) {
    if (!user) {
      return await this.serviceRepository.find({
        relations: { nestedServices: { subServices: true }, packages: true, employees: true, vendor: true, category: true, reviews: true, bookings: true },
      });
    }

    const roleName = user?.role?.toLowerCase() || '';
    if (roleName === 'super admin' || roleName === 'superadmin' || roleName === 'admin' || roleName === 'agent' || roleName === 'client') {
      return await this.serviceRepository.find({
        relations: { nestedServices: { subServices: true }, packages: true, employees: true, vendor: true, category: true, reviews: true, bookings: true },
      });
    }

    if (roleName === 'vendor') {
      return await this.serviceRepository.find({
        where: { vendor: { id: user.sub } },
        relations: { nestedServices: { subServices: true }, packages: true, employees: true, vendor: true, category: true, reviews: true, bookings: true },
      });
    }

    return await this.serviceRepository.find({
      where: { employees: { id: user.sub } },
      relations: { nestedServices: { subServices: true }, packages: true, employees: true, vendor: true, category: true, reviews: true, bookings: true },
    });
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: { nestedServices: { subServices: true }, packages: true, employees: true, vendor: true, category: true },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    const updateData: any = { ...updateServiceDto };
    
    if (updateServiceDto.employee_ids) {
      updateData.employees = updateServiceDto.employee_ids.map(eId => ({ id: eId }));
      delete updateData.employee_ids;
    }
    
    if (updateServiceDto.category_id) {
      updateData.category = { id: updateServiceDto.category_id };
      delete updateData.category_id;
    }
    
    if (updateServiceDto.vendor_id) {
      updateData.vendor = { id: updateServiceDto.vendor_id };
      delete updateData.vendor_id;
    }

    Object.assign(service, updateData);
    return await this.serviceRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    return await this.serviceRepository.remove(service);
  }
}
