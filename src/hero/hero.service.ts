import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Hero } from './entities/hero.entity';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
  ) {}

  async create(createHeroDto: CreateHeroDto): Promise<Hero> {
    const hero = this.heroRepository.create(createHeroDto);
    return this.heroRepository.save(hero);
  }

  async findAll(): Promise<Hero[]> {
    return this.heroRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Hero> {
    const hero = await this.heroRepository.findOne({
      where: { id },
    });
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
    return hero;
  }

  async update(id: number, updateHeroDto: UpdateHeroDto): Promise<Hero> {
    const hero = await this.heroRepository.preload({
      id,
      ...updateHeroDto,
    });
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
    return this.heroRepository.save(hero);
  }

  async remove(id: number): Promise<void> {
    const result = await this.heroRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hero with ID ${id} not found`);
    }
  }
}
