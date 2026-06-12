import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Roles('Super Admin')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Role created successfully',
      data,
    };
  }

  @Roles('Super Admin', 'Agent')
  @Get()
  async findAll() {
    const data = await this.rolesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Roles retrieved successfully',
      data,
    };
  }

  @Roles('Super Admin', 'Agent')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.rolesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Role retrieved successfully',
      data,
    };
  }

  @Roles('Super Admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.rolesService.update(+id, updateRoleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Role updated successfully',
      data,
    };
  }

  @Roles('Super Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Role deleted successfully',
    };
  }
}
