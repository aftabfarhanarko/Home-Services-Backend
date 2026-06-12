import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Req } from '@nestjs/common';
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

  @Roles('Super Admin', 'Agent')
  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    const data = await this.usersService.findOne(req.user.userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
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

  @Roles('Super Admin', 'Agent')
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
