import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GetwayService } from './getway.service';
import { CreateGetwayDto } from './dto/create-getway.dto';
import { UpdateGetwayDto } from './dto/update-getway.dto';

@Controller('getways')
export class GetwayController {
  constructor(private readonly getwayService: GetwayService) {}

  @Post()
  create(@Body() createGetwayDto: CreateGetwayDto) {
    return this.getwayService.create(createGetwayDto);
  }

  @Get()
  findAll() {
    return this.getwayService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.getwayService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getwayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGetwayDto: UpdateGetwayDto) {
    return this.getwayService.update(+id, updateGetwayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.getwayService.remove(+id);
  }
}
