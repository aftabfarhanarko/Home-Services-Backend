import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    const data = await this.serviceService.create(createServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Service created successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const data = await this.serviceService.findAll(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Services retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.serviceService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Service retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const data = await this.serviceService.update(+id, updateServiceDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Service updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.serviceService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Service deleted successfully',
    };
  }
}
