import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubServiceService } from './sub-service.service';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { UpdateSubServiceDto } from './dto/update-sub-service.dto';

@Controller('sub-services')
export class SubServiceController {
  constructor(private readonly subServiceService: SubServiceService) {}

  @Post()
  async create(@Body() createSubServiceDto: CreateSubServiceDto) {
    const data = await this.subServiceService.create(createSubServiceDto);
    return { statusCode: 201, message: 'SubService created successfully', data };
  }

  @Get()
  async findAll() {
    const data = await this.subServiceService.findAll();
    return { statusCode: 200, message: 'SubServices retrieved successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.subServiceService.findOne(+id);
    return { statusCode: 200, message: 'SubService retrieved successfully', data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubServiceDto: UpdateSubServiceDto) {
    const data = await this.subServiceService.update(+id, updateSubServiceDto);
    return { statusCode: 200, message: 'SubService updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subServiceService.remove(+id);
    return { statusCode: 200, message: 'SubService deleted successfully' };
  }
}
