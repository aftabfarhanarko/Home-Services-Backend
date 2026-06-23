import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { DevisionService } from './devision.service';
import { CreateDevisionDto } from './dto/create-devision.dto';
import { UpdateDevisionDto } from './dto/update-devision.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devision')
export class DevisionController {
  constructor(private readonly devisionService: DevisionService) {}

  @Roles('Super Admin')
  @Post()
  async create(@Body() createDevisionDto: CreateDevisionDto) {
    const data = await this.devisionService.create(createDevisionDto);
    return { statusCode: HttpStatus.CREATED, message: 'Devision created successfully', data };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.devisionService.findAll();
    return { statusCode: HttpStatus.OK, message: 'Devisions retrieved successfully', data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.devisionService.findOne(+id);
    return { statusCode: HttpStatus.OK, message: 'Devision retrieved successfully', data };
  }

  @Roles('Super Admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDevisionDto: UpdateDevisionDto) {
    const data = await this.devisionService.update(+id, updateDevisionDto);
    return { statusCode: HttpStatus.OK, message: 'Devision updated successfully', data };
  }

  @Roles('Super Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.devisionService.remove(+id);
    return { statusCode: HttpStatus.OK, message: 'Devision deleted successfully' };
  }
}
