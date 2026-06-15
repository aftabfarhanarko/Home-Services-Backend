import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto, @Req() req: any) {
    if (!createProfileDto.user_id) {
      createProfileDto.user_id = req.user.sub;
    }
    const data = await this.profileService.create(createProfileDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Profile created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.profileService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Profiles retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.profileService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.profileService.update(+id, updateProfileDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.profileService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile deleted successfully',
    };
  }
}
