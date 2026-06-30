import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
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
  async findAll(@Req() req: any) {
    const data = await this.packageService.findAll(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Packages retrieved successfully',
      data,
    };
  }

  @Get('public')
  async findAllPublic() {
    const data = await this.packageService.findAllPublic();
    return {
      statusCode: HttpStatus.OK,
      message: 'Service-wise packages retrieved successfully',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    const data = await this.packageService.update(+id, updatePackageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.packageService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package deleted successfully',
    };
  }
}
