import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const bookingData: any = {
      ...createBookingDto,
      user: { id: userId },
      vendor: { id: createBookingDto.vendor_id },
    };
    if (createBookingDto.nested_service_id) {
      bookingData.nestedService = { id: createBookingDto.nested_service_id };
    }
    if (createBookingDto.package_id) {
      bookingData.pkg = { id: createBookingDto.package_id };
    }
    const booking = this.bookingRepository.create(bookingData);
    return await this.bookingRepository.save(booking);
  }

  async findAll(user: any) {
    let whereCondition = {};

    if (user?.role === 'Vendor') {
      whereCondition = { vendor: { id: user.sub } };
    } else if (user?.role === 'Employee') {
      whereCondition = { employee: { id: user.sub } };
    } else if (user?.role !== 'Super Admin') {
      // For normal users or clients
      whereCondition = { user: { id: user.sub } };
    }

    return await this.bookingRepository.find({
      where: whereCondition,
      relations: { user: true, vendor: true, employee: true, nestedService: true, pkg: true },
    });
  }

  async findByVendor(vendorId: number) {
    return await this.bookingRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { user: true, employee: true, nestedService: true, pkg: true },
    });
  }

  async findByUser(userId: number) {
    return await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: { vendor: true, employee: true, nestedService: true, pkg: true },
    });
  }

  async findOne(id: number, user?: any) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true, vendor: true, employee: true, nestedService: true, pkg: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (user && user.role !== 'Super Admin') {
      const isOwner = booking.user?.id === user.sub;
      const isVendor = booking.vendor?.id === user.sub;
      const isEmployee = booking.employee?.id === user.sub;

      if (!isOwner && !isVendor && !isEmployee) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async assignEmployee(bookingId: number, employeeId: number) {
    const booking = await this.findOne(bookingId);
    booking.employee = { id: employeeId } as any;
    booking.status = BookingStatus.ASSIGNED;
    return await this.bookingRepository.save(booking);
  }

  async updateStatus(bookingId: number, status: BookingStatus) {
    const booking = await this.findOne(bookingId);
    booking.status = status;
    return await this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    return await this.bookingRepository.remove(booking);
  }
}
