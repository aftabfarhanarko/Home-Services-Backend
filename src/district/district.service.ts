import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from './entities/district.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const { devision_id, ...data } = createDistrictDto;
    const district = this.districtRepository.create({
      ...data,
      devision: { id: devision_id },
    });
    return await this.districtRepository.save(district);
  }

  async findAll() {
    return await this.districtRepository.find({ relations: { devision: true, areas: true } });
  }

  async findOne(id: number) {
    const district = await this.districtRepository.findOne({ where: { id }, relations: { devision: true, areas: true } });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return district;
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.findOne(id);
    const { devision_id, ...data } = updateDistrictDto;
    
    if (devision_id) {
      district.devision = { id: devision_id } as any;
    }
    Object.assign(district, data);
    return await this.districtRepository.save(district);
  }

  async remove(id: number) {
    const district = await this.findOne(id);
    return await this.districtRepository.remove(district);
  }
}
