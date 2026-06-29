import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() createBookingDto: CreateBookingDto) {
    const userId = req.user.sub;
    const data = await this.bookingService.create(createBookingDto, userId, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const data = await this.bookingService.findAll(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data,
    };
  }

  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string) {
    const data = await this.bookingService.findByVendor(+vendorId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vendor bookings retrieved successfully',
      data,
    };
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const data = await this.bookingService.findByUser(+userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User bookings retrieved successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const data = await this.bookingService.findOne(+id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking retrieved successfully',
      data,
    };
  }

  @Public()
  @Get('track/:id')
  async trackBooking(@Param('id') id: string) {
    const data = await this.bookingService.track(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking tracking retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const data = await this.bookingService.update(+id, updateBookingDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking updated successfully',
      data,
    };
  }

  @Post(':id/assign')
  async assignEmployees(@Param('id') id: string, @Body('employee_ids') employeeIds: number[]) {
    const data = await this.bookingService.assignEmployees(+id, employeeIds);
    return {
      statusCode: HttpStatus.OK,
      message: 'Employees assigned to booking successfully',
      data,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    const data = await this.bookingService.updateStatus(+id, status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking status updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bookingService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Booking deleted successfully',
    };
  }
}
