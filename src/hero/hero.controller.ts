import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  async create(@Body() createHeroDto: CreateHeroDto) {
    const data = await this.heroService.create(createHeroDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hero section created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.heroService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Hero sections retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.heroService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hero section retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    const data = await this.heroService.update(+id, updateHeroDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hero section updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.heroService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Hero section deleted successfully',
    };
  }
}
