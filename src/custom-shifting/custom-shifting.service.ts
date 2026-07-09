import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomShifting, ShiftingStatus } from './entities/custom-shifting.entity';
import { CreateCustomShiftingDto } from './dto/create-custom-shifting.dto';
import { User } from '../users/entities/user.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class CustomShiftingService {
  constructor(
    @InjectRepository(CustomShifting)
    private readonly shiftingRepository: Repository<CustomShifting>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly smsService: SmsService,
  ) {}

  async create(createDto: CreateCustomShiftingDto): Promise<CustomShifting> {
    const shifting = this.shiftingRepository.create({
      name: createDto.name,
      phone: createDto.phone,
      email: createDto.email,
      shiftingType: createDto.shiftingType,
      sourceAddress: createDto.sourceAddress,
      destinationAddress: createDto.destinationAddress,
      images: createDto.images || [],
      status: ShiftingStatus.PENDING,
      user: createDto.userId ? { id: createDto.userId } as any : undefined,
    });

    return this.shiftingRepository.save(shifting);
  }

  async findAll(user: any): Promise<CustomShifting[]> {
    const roleName = user?.role?.toLowerCase() || '';

    if (roleName === 'super admin' || roleName === 'superadmin') {
      return this.shiftingRepository.find({
        relations: { user: true, vendor: { role: true, profile: true } },
        order: { createdAt: 'DESC' },
      });
    }

    if (roleName === 'vendor') {
      return this.shiftingRepository.find({
        where: { vendor: { id: user.sub } },
        relations: { user: true, vendor: { role: true, profile: true } },
        order: { createdAt: 'DESC' },
      });
    }

    if (roleName === 'client') {
      return this.shiftingRepository.find({
        where: { user: { id: user.sub } },
        relations: { user: true, vendor: { role: true, profile: true } },
        order: { createdAt: 'DESC' },
      });
    }

    return [];
  }

  async findOne(id: number): Promise<CustomShifting> {
    const booking = await this.shiftingRepository.findOne({
      where: { id },
      relations: { user: true, vendor: { role: true, profile: true } },
    });

    if (!booking) {
      throw new NotFoundException(`Custom shifting booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByVendor(vendorId: number): Promise<CustomShifting[]> {
    return this.shiftingRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { user: true, vendor: { role: true, profile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<CustomShifting[]> {
    return this.shiftingRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, vendor: { role: true, profile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async assignVendor(id: number, vendorId: number): Promise<CustomShifting> {
    const booking = await this.findOne(id);
    
    // Verify vendor exists and has Vendor role
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId },
      relations: { role: true },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    booking.vendor = vendor;
    booking.status = ShiftingStatus.ASSIGNED;

    const saved = await this.shiftingRepository.save(booking);

    // Send SMS notification to the vendor
    if (vendor.phone) {
      const message =
        `Rajseba: আপনাকে একটি কাস্টম শিফটিং বুকিং (ID: ${id}) assign করা হয়েছে। ` +
        `${booking.shiftingType === 'office' ? 'অফিস' : 'হোম'} শিফটিং — ` +
        `${booking.sourceAddress} থেকে ${booking.destinationAddress}। ` +
        `আপনার ড্যাশবোর্ড চেক করুন।`;
      this.smsService.sendMessage(vendor.phone, message).catch(() => {});
    }

    return saved;
  }

  async updateStatus(id: number, status: ShiftingStatus): Promise<CustomShifting> {
    const booking = await this.findOne(id);
    booking.status = status;
    return this.shiftingRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.shiftingRepository.remove(booking);
  }
}
