import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async create(@Body() createBlogDto: CreateBlogDto) {
    const data = await this.blogService.create(createBlogDto);
    return {
      success: true,
      message: 'Blog created successfully',
      data,
    };
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const data = await this.blogService.findAll(search);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.blogService.findOne(+id);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const data = await this.blogService.update(+id, updateBlogDto);
    return {
      success: true,
      message: 'Blog updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.blogService.remove(+id);
    return {
      success: true,
      message: 'Blog deleted successfully',
    };
  }
}
