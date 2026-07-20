import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CustomRequestService } from './custom-request.service';
import { CreateCustomRequestDto } from './dto/create-custom-request.dto';
import { CustomRequestStatus } from './entities/custom-request.entity';

@Controller('custom-requests')
export class CustomRequestController {
  constructor(private readonly customRequestService: CustomRequestService) {}

  @Public()
  @Post()
  async create(@Body() createDto: CreateCustomRequestDto) {
    const data = await this.customRequestService.create(createDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Custom service request submitted successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const data = await this.customRequestService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom service requests retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.customRequestService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom service request retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: CustomRequestStatus) {
    const data = await this.customRequestService.updateStatus(+id, status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom service request status updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.customRequestService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Custom service request deleted successfully',
    };
  }
}
