import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Roles('Super Admin')
  @Post()
  async create(@Body() createAreaDto: CreateAreaDto) {
    const data = await this.areaService.create(createAreaDto);
    return { statusCode: HttpStatus.CREATED, message: 'Area created successfully', data };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.areaService.findAll();
    return { statusCode: HttpStatus.OK, message: 'Areas retrieved successfully', data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.areaService.findOne(+id);
    return { statusCode: HttpStatus.OK, message: 'Area retrieved successfully', data };
  }

  @Roles('Super Admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    const data = await this.areaService.update(+id, updateAreaDto);
    return { statusCode: HttpStatus.OK, message: 'Area updated successfully', data };
  }

  @Roles('Super Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.areaService.remove(+id);
    return { statusCode: HttpStatus.OK, message: 'Area deleted successfully' };
  }
}
