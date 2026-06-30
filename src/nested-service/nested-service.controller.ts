import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { NestedServiceService } from './nested-service.service';
import { CreateNestedServiceDto } from './dto/create-nested-service.dto';
import { UpdateNestedServiceDto } from './dto/update-nested-service.dto';

@Controller('nested-services')
export class NestedServiceController {
  constructor(private readonly nestedServiceService: NestedServiceService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
  @Post()
  async create(@Body() createNestedServiceDto: CreateNestedServiceDto) {
    const data = await this.nestedServiceService.create(createNestedServiceDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Nested Service created successfully',
      data,
    };
  }

  @Get()
  async findAll(@Req() req: any) {
    const data = await this.nestedServiceService.findAll(req.user);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNestedServiceDto: UpdateNestedServiceDto) {
    const data = await this.nestedServiceService.update(+id, updateNestedServiceDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Service updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.nestedServiceService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Nested Service deleted successfully',
    };
  }
}
