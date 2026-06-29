import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SearchServiceDto } from './dto/search-service.dto';
import { Service } from './entities/service.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly notificationService: NotificationService,
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
    const savedService = await this.serviceRepository.save(service);
    
    // Trigger Notification
    const msg = `New service '${savedService.name}' has been created.`;
    this.notificationService.createForSuperAdmins(msg, NotificationType.SERVICE).catch(e => console.error(e));
    
    return savedService;
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

  async search(params: SearchServiceDto) {
    const qb = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.vendor', 'vendor')
      .leftJoinAndSelect('vendor.profile', 'profile')
      .leftJoinAndSelect('profile.devision', 'devision')
      .leftJoinAndSelect('service.nestedServices', 'nestedServices')
      .leftJoinAndSelect('nestedServices.subServices', 'subServices')
      .leftJoinAndSelect('service.packages', 'packages')
      .leftJoinAndSelect('service.employees', 'employees')
      .leftJoinAndSelect('service.reviews', 'reviews')
      .leftJoinAndSelect('service.bookings', 'bookings')
      .where('service.deletedAt IS NULL');

    if (params.category_id) {
      qb.andWhere('category.id = :categoryId', { categoryId: params.category_id });
    }

    if (params.devision_id) {
      qb.andWhere('devision.id = :devisionId', { devisionId: params.devision_id });
    }

    if (params.q?.trim()) {
      const term = `%${params.q.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(service.name) LIKE :term OR LOWER(service.subtitle) LIKE :term OR LOWER(service.description) LIKE :term)',
        { term },
      );
    }

    return qb.orderBy('service.createdAt', 'DESC').getMany();
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
