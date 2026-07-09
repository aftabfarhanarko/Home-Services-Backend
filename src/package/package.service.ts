import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
import { PackageItem } from './entities/package-item.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageItem)
    private readonly packageItemRepository: Repository<PackageItem>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const pkg = this.packageRepository.create({
      ...createPackageDto,
      service: { id: createPackageDto.service_id },
      items: createPackageDto.nested_service_ids?.map(id => ({
        nestedService: { id }
      })) || [],
    });
    return await this.packageRepository.save(pkg);
  }

  async findAll(user?: any) {
    if (user?.role === 'Vendor') {
      return await this.packageRepository.find({
        where: { service: { vendor: { id: user.sub } } },
        relations: { service: { vendor: true }, items: { nestedService: true }, bookings: true },
      });
    }

    return await this.packageRepository.find({
      relations: { service: true, items: { nestedService: true }, bookings: true },
    });
  }

  async findAllPublic() {
    const packages = await this.packageRepository.find({
      relations: { service: { vendor: true }, items: { nestedService: true }, bookings: true },
    });

    const grouped = packages.reduce((acc, pkg) => {
      const serviceId = pkg.service?.id || 'unassigned';
      if (!acc[serviceId]) {
        acc[serviceId] = {
          service: pkg.service || null,
          packages: [],
        };
      }
      acc[serviceId].packages.push(pkg);
      return acc;
    }, {} as any);

    return Object.values(grouped);
  }

  async findByServiceId(serviceId: number) {
    return await this.packageRepository.find({
      where: { service: { id: serviceId } },
      relations: { items: { nestedService: true }, bookings: true },
    });
  }

  async findOne(id: number) {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: { service: true, items: { nestedService: true }, bookings: true },
    });
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return pkg;
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.findOne(id);
    if (updatePackageDto.service_id) {
        pkg.service = { id: updatePackageDto.service_id } as any;
    }
    if (updatePackageDto.nested_service_ids) {
        // remove old items and add new ones (simplified)
        await this.packageItemRepository.delete({ package: { id } });
        pkg.items = updatePackageDto.nested_service_ids.map(nid => this.packageItemRepository.create({ nestedService: { id: nid } }));
    }
    Object.assign(pkg, {
        name: updatePackageDto.name ?? pkg.name,
        description: updatePackageDto.description ?? pkg.description,
        price: updatePackageDto.price ?? pkg.price,
    });
    return await this.packageRepository.save(pkg);
  }

  async remove(id: number) {
    const pkg = await this.findOne(id);
    return await this.packageRepository.remove(pkg);
  }
}
