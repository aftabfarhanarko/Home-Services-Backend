import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { SubService } from '../sub-service/entities/sub-service.entity';
import { Package } from '../package/entities/package.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(SubService)
    private readonly subServiceRepository: Repository<SubService>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const finalUserId = createBookingDto.user_id || userId;
    const bookingData: any = {
      ...createBookingDto,
      user: { id: finalUserId },
      vendor: { id: createBookingDto.vendor_id },
      service: createBookingDto.service_id ? { id: createBookingDto.service_id } : undefined,
    };
    delete bookingData.user_id;
    delete bookingData.service_id;

    let totalPrice = 0;

    if (createBookingDto.sub_service_ids && createBookingDto.sub_service_ids.length > 0) {
      const subServices = await this.subServiceRepository.find({
        where: { id: In(createBookingDto.sub_service_ids) }
      });
      bookingData.subServices = subServices;
      totalPrice += subServices.reduce((sum, ss) => sum + Number(ss.price || 0), 0);
    }
    
    if (createBookingDto.package_id) {
      const pkg = await this.packageRepository.findOne({
        where: { id: createBookingDto.package_id }
      });
      if (pkg) {
        bookingData.pkg = pkg;
        totalPrice += Number(pkg.price || 0);
      }
    }

    bookingData.total_price = totalPrice;
    const booking = this.bookingRepository.create(bookingData);
    return await this.bookingRepository.save(booking);
  }

  async findAll(user: any) {
    let whereCondition = {};

    const roleName = user?.role?.toLowerCase() || '';

    if (roleName === 'vendor') {
      whereCondition = { vendor: { id: user.sub } };
    } else if (roleName === 'employee') {
      whereCondition = { employees: { id: user.sub } };
    } else if (roleName === 'agent') {
      whereCondition = [
        { agent: { id: user.sub } },
        { user: { agent: { id: user.sub } } }
      ];
    } else if (roleName !== 'super admin' && roleName !== 'superadmin' && roleName !== 'admin') {
      // For normal users or clients
      whereCondition = { user: { id: user.sub } };
    }

    return await this.bookingRepository.find({
      where: whereCondition,
      relations: { user: { agent: true }, vendor: true, employees: true, subServices: true, pkg: true, service: true, agent: true },
    });
  }

  async findByVendor(vendorId: number) {
    return await this.bookingRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { user: true, employees: true, subServices: true, pkg: true, service: true },
    });
  }

  async findByUser(userId: number) {
    return await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: { vendor: true, employees: true, subServices: true, pkg: true, service: true },
    });
  }

  async findOne(id: number, user?: any) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: { agent: true }, vendor: true, employees: true, subServices: true, pkg: true, service: true, agent: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const roleName = user?.role?.toLowerCase() || '';
    if (user && roleName !== 'super admin' && roleName !== 'superadmin' && roleName !== 'admin') {
      const isOwner = booking.user?.id === user.sub;
      const isVendor = booking.vendor?.id === user.sub;
      const isEmployee = booking.employees?.some((emp: any) => emp.id === user.sub);

      const isAgent = booking.agent?.id === user.sub || booking.user?.agent?.id === user.sub;

      if (!isOwner && !isVendor && !isEmployee && !isAgent) {
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

  async assignEmployees(bookingId: number, employeeIds: number[]) {
    const booking = await this.findOne(bookingId);
    booking.employees = employeeIds.map(id => ({ id } as any));
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
