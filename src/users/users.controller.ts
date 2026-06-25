import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data,
    };
  }

  @Roles('Super Admin', 'Agent', 'Vendor')
  @Get()
  async findAll(@Req() req: any, @Query('role') role?: string) {
    const data = await this.usersService.findAll(req.user, role);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    const data = await this.usersService.findOne(req.user.userId || req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data,
    };
  }

  @Get('me/saved-services')
  async getSavedServices(@Req() req: any) {
    const data = await this.usersService.getSavedServices(req.user.sub || req.user.userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Saved services retrieved successfully',
      data,
    };
  }

  @Post('me/saved-services/:serviceId')
  async toggleSavedService(@Req() req: any, @Param('serviceId') serviceId: string) {
    const data = await this.usersService.toggleSavedService(req.user.sub || req.user.userId, +serviceId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Saved services updated successfully',
      data,
    };
  }

  @Public()
  @Get('employees/vendor/:vendorId')
  async findEmployeesByVendor(@Param('vendorId') vendorId: string) {
    const data = await this.usersService.findEmployeesByVendor(+vendorId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Employees retrieved successfully',
      data,
    };
  }

  @Roles('Super Admin', 'Agent', 'Vendor', 'Client')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data,
    };
  }

  @Roles('Super Admin', 'Agent', 'Vendor', 'Client')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data,
    };
  }

  @Roles('Super Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
