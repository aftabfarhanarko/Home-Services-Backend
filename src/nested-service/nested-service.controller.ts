import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { NestedServiceService } from './nested-service.service';
import { CreateNestedServiceDto } from './dto/create-nested-service.dto';
import { UpdateNestedServiceDto } from './dto/update-nested-service.dto';

@Controller('nested-services')
export class NestedServiceController {
  constructor(private readonly nestedServiceService: NestedServiceService) {}

  @Post()
  async create(@Body() createNestedServiceDto: CreateNestedServiceDto) {
    const vendorId = 1; // placeholder
    const data = await this.nestedServiceService.create(createNestedServiceDto, vendorId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Nested Service created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.nestedServiceService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Services retrieved successfully',
      data,
    };
  }

  @Get('service/:serviceId')
  async findByServiceId(@Param('serviceId') serviceId: string) {
    const data = await this.nestedServiceService.findByServiceId(+serviceId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Services by Service retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.nestedServiceService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Service retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNestedServiceDto: UpdateNestedServiceDto) {
    const data = await this.nestedServiceService.update(+id, updateNestedServiceDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Service updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.nestedServiceService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Service deleted successfully',
    };
  }
}
