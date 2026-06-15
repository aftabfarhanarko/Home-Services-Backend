import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    const data = await this.packageService.create(createPackageDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Package created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.packageService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Packages retrieved successfully',
      data,
    };
  }

  @Get('service/:serviceId')
  findByServiceId(@Param('serviceId') serviceId: string) {
    return this.packageService.findByServiceId(+serviceId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.packageService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    const data = await this.packageService.update(+id, updatePackageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.packageService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package deleted successfully',
    };
  }
}
