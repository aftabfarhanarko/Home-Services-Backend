import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { SubService } from '../sub-service/entities/sub-service.entity';
import { Package } from '../package/entities/package.entity';
import { CouponService } from '../coupon/coupon.service';
import { SmsService } from '../sms/sms.service';
import { UsersService } from '../users/users.service';
import { RoleType } from '../roles/entities/role.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(SubService)
    private readonly subServiceRepository: Repository<SubService>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly couponService: CouponService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) { }

  async create(createBookingDto: CreateBookingDto, userId: number, userReq?: any) {
    const finalUserId = createBookingDto.user_id || userId;
    const bookingData: any = {
      ...createBookingDto,
      user: { id: finalUserId },
      vendor: { id: createBookingDto.vendor_id },
      service: createBookingDto.service_id ? { id: createBookingDto.service_id } : undefined,
    };
    delete bookingData.user_id;
    delete bookingData.service_id;

    if (userReq?.role?.toLowerCase().replace(/\s+/g, '') === 'agent') {
      bookingData.agent = { id: userId };
    }

    let totalPrice = 0;
    const bookingQuantity = createBookingDto.quantity && createBookingDto.quantity > 0
      ? createBookingDto.quantity
      : 1;
    bookingData.quantity = bookingQuantity;

    const subServiceItems = createBookingDto.sub_service_items?.length
      ? createBookingDto.sub_service_items
      : (createBookingDto.sub_service_ids || []).map((id) => ({
        sub_service_id: id,
        quantity: 1,
      }));

    if (subServiceItems.length > 0) {
      const subServiceIds = subServiceItems.map((item) => item.sub_service_id);
      const subServices = await this.subServiceRepository.find({
        where: { id: In(subServiceIds) },
      });
      bookingData.subServices = subServices;
      bookingData.sub_service_items = subServiceItems;
      totalPrice += subServiceItems.reduce((sum, item) => {
        const subService = subServices.find((ss) => ss.id === item.sub_service_id);
        return sum + Number(subService?.price || 0) * item.quantity;
      }, 0);
    }

    delete bookingData.sub_service_ids;

    if (createBookingDto.package_id) {
      const pkg = await this.packageRepository.findOne({
        where: { id: createBookingDto.package_id }
      });
      if (pkg) {
        bookingData.pkg = pkg;
        totalPrice += Number(pkg.price || 0) * bookingQuantity;
      }
    }

    bookingData.subtotal = totalPrice;
    bookingData.discount_amount = 0;
    bookingData.total_price = totalPrice;

    if (createBookingDto.coupon_code?.trim()) {
      const couponResult = await this.couponService.applyCoupon(
        createBookingDto.coupon_code,
        totalPrice,
        createBookingDto.service_id,
        createBookingDto.package_id,
      );
      bookingData.coupon_code = couponResult.coupon.code;
      bookingData.discount_amount = couponResult.discount_amount;
      bookingData.total_price = couponResult.final_price;
    }

    const booking = this.bookingRepository.create(bookingData);
    const saveResult = await this.bookingRepository.save(booking);
    const savedBooking = Array.isArray(saveResult) ? saveResult[0] : saveResult;

    const requesterRole = userReq?.role?.toLowerCase().replace(/\s+/g, '') || '';
    if (requesterRole === 'client') {
      this.notifyVendorAndSuperAdmin(savedBooking.id, createBookingDto.vendor_id).catch(
        (error) =>
          this.logger.error(
            `Failed to send booking SMS notifications for booking #${savedBooking.id}`,
            error?.message || error,
          ),
      );
    }

    // Trigger Notification System
    const msg = `New booking #${savedBooking.id} created.`;
    this.notificationService.createForSuperAdmins(msg, NotificationType.BOOKING).catch(e => this.logger.error(e));
    if (createBookingDto.vendor_id) {
      this.notificationService.createForUser(createBookingDto.vendor_id, msg, NotificationType.BOOKING).catch(e => this.logger.error(e));
    }

    return savedBooking;
  }

  private getStatusLabel(status: BookingStatus): string {
    const labels: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: 'Pending',
      [BookingStatus.ASSIGNED]: 'Assigned',
      [BookingStatus.ON_THE_WAY]: 'On the way',
      [BookingStatus.COMPLETED]: 'Completed',
      [BookingStatus.CANCELLED]: 'Cancelled',
    };
    return labels[status] || status;
  }

  private buildStatusChangeSmsMessage(booking: Booking, newStatus: BookingStatus) {
    const serviceLabel =
      booking.service?.name ||
      booking.pkg?.name ||
      booking.subServices?.map((s) => s.name).join(', ') ||
      'your service';
    const schedule = booking.time ? `${booking.date} ${booking.time}` : booking.date;
    const statusLabel = this.getStatusLabel(newStatus);
    const trackingLink = `https://www.rajseba.com/track/${booking.id}`;

    return (
      `Rajsheba: Booking #${booking.id} status updated to "${statusLabel}". ` +
      `Service: ${serviceLabel}. Scheduled: ${schedule}. ` +
      `Track your booking: ${trackingLink}`
    );
  }

  private buildAgentStatusSmsMessage(booking: Booking, newStatus: BookingStatus) {
    const clientName = booking.user?.name || 'Client';
    const clientPhone = booking.user?.phone || 'N/A';
    const serviceLabel =
      booking.service?.name ||
      booking.pkg?.name ||
      booking.subServices?.map((s) => s.name).join(', ') ||
      'Service';
    const schedule = booking.time ? `${booking.date} ${booking.time}` : booking.date;
    const statusLabel = this.getStatusLabel(newStatus);

    return (
      `Rajsheba Agent: Booking #${booking.id} for ${clientName} (${clientPhone}) ` +
      `is now "${statusLabel}". Service: ${serviceLabel}. ` +
      `Scheduled: ${schedule}. Location: ${booking.location}.`
    );
  }

  private async notifyAgentOnStatusChange(
    bookingId: number,
    newStatus: BookingStatus,
    previousStatus?: BookingStatus,
  ) {
    if (previousStatus && previousStatus === newStatus) return;

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { user: true, agent: true, service: true, pkg: true, subServices: true },
    });

    if (!booking?.agent?.phone) return;

    const message = this.buildAgentStatusSmsMessage(booking, newStatus);
    await this.smsService.sendMessage(booking.agent.phone, message);
  }

  private async notifyClientOnStatusChange(
    bookingId: number,
    newStatus: BookingStatus,
    previousStatus?: BookingStatus,
  ) {
    if (previousStatus && previousStatus === newStatus) return;

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { user: true, service: true, pkg: true, subServices: true },
    });

    if (!booking?.user?.phone) return;

    const message = this.buildStatusChangeSmsMessage(booking, newStatus);
    await this.smsService.sendMessage(booking.user.phone, message);
  }

  private buildCompletedBookingSmsMessage(booking: Booking) {
    const clientName = booking.user?.name || 'Client';
    const clientPhone = booking.user?.phone || 'N/A';
    const serviceLabel =
      booking.service?.name ||
      booking.pkg?.name ||
      booking.subServices?.map((s) => s.name).join(', ') ||
      'Service';
    const schedule = booking.time ? `${booking.date} ${booking.time}` : booking.date;

    return (
      `Rajsheba: Booking #${booking.id} has been completed. ` +
      `Client: ${clientName} (${clientPhone}). ${serviceLabel}. ` +
      `Date: ${schedule}. Location: ${booking.location}. ` +
      `Total: ৳${Number(booking.total_price || 0).toLocaleString()}.`
    );
  }

  private async notifyVendorAndSuperAdminOnCompletion(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { user: true, vendor: true, agent: true, service: true, pkg: true, subServices: true },
    });

    if (!booking) return;

    const message = this.buildCompletedBookingSmsMessage(booking);
    const recipientPhones = new Set<string>();

    const vendorId = booking.vendor?.id;
    if (vendorId) {
      const vendor = await this.usersService.findOne(vendorId);
      if (vendor?.phone) recipientPhones.add(vendor.phone);
    }

    const superAdmins = await this.usersService.findByRoleName(RoleType.SUPER_ADMIN);
    for (const admin of superAdmins) {
      if (admin.phone) recipientPhones.add(admin.phone);
    }

    const fallbackPhone = this.configService.get<string>('SUPERADMIN_PHONE');
    if (fallbackPhone) recipientPhones.add(fallbackPhone);

    await Promise.all(
      [...recipientPhones].map((phone) => this.smsService.sendMessage(phone, message)),
    );
  }

  private sendStatusChangeNotifications(
    bookingId: number,
    newStatus: BookingStatus,
    previousStatus?: BookingStatus,
  ) {
    if (previousStatus && previousStatus === newStatus) return;

    this.notifyClientOnStatusChange(bookingId, newStatus, previousStatus).catch(
      (error) =>
        this.logger.error(
          `Failed to send status SMS to client for booking #${bookingId}`,
          error?.message || error,
        ),
    );

    this.notifyAgentOnStatusChange(bookingId, newStatus, previousStatus).catch(
      (error) =>
        this.logger.error(
          `Failed to send status SMS to agent for booking #${bookingId}`,
          error?.message || error,
        ),
    );

    if (newStatus === BookingStatus.COMPLETED) {
      this.notifyVendorAndSuperAdminOnCompletion(bookingId).catch((error) =>
        this.logger.error(
          `Failed to send completion SMS to vendor/admin for booking #${bookingId}`,
          error?.message || error,
        ),
      );
    }
  }

  private buildBookingSmsMessage(booking: Booking, clientName: string, clientPhone: string) {
    const serviceLabel =
      booking.service?.name ||
      booking.pkg?.name ||
      booking.subServices?.map((s) => s.name).join(', ') ||
      'Service';
    const schedule = booking.time ? `${booking.date} ${booking.time}` : booking.date;

    return (
      `Rajsheba: New booking #${booking.id} by ${clientName} (${clientPhone}). ` +
      `${serviceLabel}. Date: ${schedule}. Location: ${booking.location}. ` +
      `Total: ৳${Number(booking.total_price || 0).toLocaleString()}.`
    );
  }

  private async notifyVendorAndSuperAdmin(bookingId: number, vendorId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { user: true, vendor: true, service: true, pkg: true, subServices: true },
    });

    if (!booking) return;

    const clientName = booking.user?.name || 'Client';
    const clientPhone = booking.user?.phone || 'N/A';
    const message = this.buildBookingSmsMessage(booking, clientName, clientPhone);
    const recipientPhones = new Set<string>();

    if (vendorId) {
      const vendor = await this.usersService.findOne(vendorId);
      if (vendor?.phone) recipientPhones.add(vendor.phone);
    }

    const superAdmins = await this.usersService.findByRoleName(RoleType.SUPER_ADMIN);
    for (const admin of superAdmins) {
      if (admin.phone) recipientPhones.add(admin.phone);
    }

    const fallbackPhone = this.configService.get<string>('SUPERADMIN_PHONE');
    if (fallbackPhone) recipientPhones.add(fallbackPhone);

    await Promise.all(
      [...recipientPhones].map((phone) => this.smsService.sendMessage(phone, message)),
    );
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

  async track(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: { agent: true }, vendor: true, employees: true, subServices: true, pkg: true, service: true, agent: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    const previousStatus = booking.status;
    Object.assign(booking, updateBookingDto);

    const saveResult = await this.bookingRepository.save(booking);
    const savedBooking = Array.isArray(saveResult) ? saveResult[0] : saveResult;

    if (savedBooking.status !== previousStatus) {
      this.sendStatusChangeNotifications(savedBooking.id, savedBooking.status, previousStatus);
    }

    return savedBooking;
  }

  async assignEmployees(bookingId: number, employeeIds: number[]) {
    const booking = await this.findOne(bookingId);
    const previousStatus = booking.status;
    booking.employees = employeeIds.map(id => ({ id } as any));
    booking.status = BookingStatus.ASSIGNED;

    const saveResult = await this.bookingRepository.save(booking);
    const savedBooking = Array.isArray(saveResult) ? saveResult[0] : saveResult;

    if (previousStatus !== BookingStatus.ASSIGNED) {
      this.sendStatusChangeNotifications(savedBooking.id, BookingStatus.ASSIGNED, previousStatus);
    }

    return savedBooking;
  }

  async updateStatus(bookingId: number, status: BookingStatus) {
    const booking = await this.findOne(bookingId);
    const previousStatus = booking.status;
    booking.status = status;

    const saveResult = await this.bookingRepository.save(booking);
    const savedBooking = Array.isArray(saveResult) ? saveResult[0] : saveResult;

    this.sendStatusChangeNotifications(savedBooking.id, status, previousStatus);

    // In-App Notification for Booking Status Change
    if (status === BookingStatus.COMPLETED) {
      const msg = `Booking #${savedBooking.id} has been completed.`;
      this.notificationService.createForSuperAdmins(msg, NotificationType.BOOKING).catch(e => this.logger.error(e));
      if (booking.vendor?.id) {
        this.notificationService.createForUser(booking.vendor.id, msg, NotificationType.BOOKING).catch(e => this.logger.error(e));
      }
      if (booking.user?.id) {
        this.notificationService.createForUser(booking.user.id, msg, NotificationType.BOOKING).catch(e => this.logger.error(e));
      }
    }

    return savedBooking;
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    return await this.bookingRepository.remove(booking);
  }
}
