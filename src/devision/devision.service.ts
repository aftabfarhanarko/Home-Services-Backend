import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDevisionDto } from './dto/create-devision.dto';
import { UpdateDevisionDto } from './dto/update-devision.dto';
import { Devision } from './entities/devision.entity';

@Injectable()
export class DevisionService {
  constructor(
    @InjectRepository(Devision)
    private devisionRepository: Repository<Devision>,
  ) {}

  async create(createDevisionDto: CreateDevisionDto) {
    const devision = this.devisionRepository.create(createDevisionDto);
    return await this.devisionRepository.save(devision);
  }

  async findAll() {
    return await this.devisionRepository.find({ relations: { districts: true } });
  }

  async findOne(id: number) {
    const devision = await this.devisionRepository.findOne({ where: { id }, relations: { districts: true } });
    if (!devision) {
      throw new NotFoundException(`Devision with ID ${id} not found`);
    }
    return devision;
  }

  async update(id: number, updateDevisionDto: UpdateDevisionDto) {
    const devision = await this.findOne(id);
    Object.assign(devision, updateDevisionDto);
    return await this.devisionRepository.save(devision);
  }

  async remove(id: number) {
    const devision = await this.findOne(id);
    return await this.devisionRepository.remove(devision);
  }
}
