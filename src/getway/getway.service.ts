import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGetwayDto } from './dto/create-getway.dto';
import { UpdateGetwayDto } from './dto/update-getway.dto';
import { Getway } from './entities/getway.entity';

@Injectable()
export class GetwayService {
  constructor(
    @InjectRepository(Getway)
    private readonly getwayRepository: Repository<Getway>,
  ) {}

  async create(createGetwayDto: CreateGetwayDto) {
    const getway = this.getwayRepository.create({
      getway_type: createGetwayDto.getway_type,
      info: createGetwayDto.info,
      user: { id: createGetwayDto.userId },
    });
    return await this.getwayRepository.save(getway);
  }

  async findAll() {
    return await this.getwayRepository.find({ relations: { user: true } });
  }

  async findByUser(userId: number) {
    return await this.getwayRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
  }

  async findOne(id: number) {
    const getway = await this.getwayRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!getway) {
      throw new NotFoundException(`Getway #${id} not found`);
    }
    return getway;
  }

  async update(id: number, updateGetwayDto: UpdateGetwayDto) {
    const getway = await this.findOne(id);
    if (updateGetwayDto.getway_type) {
      getway.getway_type = updateGetwayDto.getway_type;
    }
    if (updateGetwayDto.info) {
      getway.info = { ...getway.info, ...updateGetwayDto.info };
    }
    return await this.getwayRepository.save(getway);
  }

  async remove(id: number) {
    const getway = await this.findOne(id);
    return await this.getwayRepository.remove(getway);
  }
}
