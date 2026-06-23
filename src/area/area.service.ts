import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const { district_id, ...data } = createAreaDto;
    const area = this.areaRepository.create({
      ...data,
      district: { id: district_id },
    });
    return await this.areaRepository.save(area);
  }

  async findAll() {
    return await this.areaRepository.find({ relations: { district: true } });
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOne({ where: { id }, relations: { district: true } });
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }
    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id);
    const { district_id, ...data } = updateAreaDto;
    
    if (district_id) {
      area.district = { id: district_id } as any;
    }
    Object.assign(area, data);
    return await this.areaRepository.save(area);
  }

  async remove(id: number) {
    const area = await this.findOne(id);
    return await this.areaRepository.remove(area);
  }
}
