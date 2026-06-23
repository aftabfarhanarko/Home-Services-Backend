import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Roles('Super Admin')
  @Post()
  async create(@Body() createDistrictDto: CreateDistrictDto) {
    const data = await this.districtService.create(createDistrictDto);
    return { statusCode: HttpStatus.CREATED, message: 'District created successfully', data };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.districtService.findAll();
    return { statusCode: HttpStatus.OK, message: 'Districts retrieved successfully', data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.districtService.findOne(+id);
    return { statusCode: HttpStatus.OK, message: 'District retrieved successfully', data };
  }

  @Roles('Super Admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    const data = await this.districtService.update(+id, updateDistrictDto);
    return { statusCode: HttpStatus.OK, message: 'District updated successfully', data };
  }

  @Roles('Super Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.districtService.remove(+id);
    return { statusCode: HttpStatus.OK, message: 'District deleted successfully' };
  }
}
