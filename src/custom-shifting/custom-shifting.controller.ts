import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CustomShiftingService } from './custom-shifting.service';
import { CreateCustomShiftingDto } from './dto/create-custom-shifting.dto';
import { ShiftingStatus } from './entities/custom-shifting.entity';

@Controller('custom-shifting')
export class CustomShiftingController {
  constructor(private readonly shiftingService: CustomShiftingService) {}

  @Public()
  @Post()
  async create(@Body() createDto: CreateCustomShiftingDto) {
    const data = await this.shiftingService.create(createDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Shifting booking created successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const data = await this.shiftingService.findAll(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shifting bookings retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.shiftingService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shifting booking retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string) {
    const data = await this.shiftingService.findByVendor(+vendorId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vendor shifting bookings retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const data = await this.shiftingService.findByUser(+userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User shifting bookings retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign')
  async assignVendor(@Param('id') id: string, @Body('vendorId') vendorId: number) {
    const data = await this.shiftingService.assignVendor(+id, vendorId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vendor assigned to shifting booking successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: ShiftingStatus) {
    const data = await this.shiftingService.updateStatus(+id, status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shifting booking status updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/price')
  async updatePrice(@Param('id') id: string, @Body('price') price: number) {
    const data = await this.shiftingService.updatePrice(+id, price);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shifting booking price updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shiftingService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shifting booking deleted successfully',
    };
  }
}
