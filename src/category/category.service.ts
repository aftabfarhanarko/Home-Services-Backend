import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, ...rest } = createCategoryDto;
    const category = this.categoryRepository.create(rest);

    if (parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent category with ID ${parentId} not found`);
      }
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: { children: true, parent: true },
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: { children: true, parent: true }
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { parentId, ...rest } = updateCategoryDto;
    
    const category = await this.categoryRepository.preload({
      id,
      ...rest,
    });

    if (category && parentId !== undefined) {
      if (parentId === null) {
        category.parent = null;
      } else {
        const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent category with ID ${parentId} not found`);
        }
        category.parent = parent;
      }
    }

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
