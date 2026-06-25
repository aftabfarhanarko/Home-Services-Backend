import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    const data = await this.serviceService.create(createServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Service created successfully',
      data,
    };
  }

  @Get('public')
  async findAllPublic() {
    try {
      const data = await this.serviceService.findAll(null);
      return {
        statusCode: HttpStatus.OK,
        message: 'Public services retrieved successfully',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    try {
      const data = await this.serviceService.findAll(req.user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Services retrieved successfully',
        data,
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching services',
        error: error.message,
        stack: error.stack,
        userRole: req.user?.role,
        userSub: req.user?.sub
      };
    }
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
