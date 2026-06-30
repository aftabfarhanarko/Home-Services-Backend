import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw, WithdrawStatus } from './entities/withdraw.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { SmsService } from '../sms/sms.service';
import { RoleType } from '../roles/entities/role.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly smsService: SmsService,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWithdrawDto: CreateWithdrawDto, vendorId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: createWithdrawDto.bookingId },
      relations: { vendor: true, agent: true, service: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${createWithdrawDto.bookingId} not found`);
    }

    const requester = await this.userRepository.findOne({ 
      where: { id: vendorId },
      relations: { role: true }
    });
    
    if (!requester) {
      throw new NotFoundException(`User with ID ${vendorId} not found`);
    }
    
    const roleName = requester?.role?.name?.toLowerCase() || '';
    
    if (roleName === 'agent') {
      if (booking.agent?.id !== vendorId) {
        throw new Error(`Booking ${createWithdrawDto.bookingId} does not belong to agent ${vendorId}`);
      }
    } else {
      if (booking.vendor?.id !== vendorId) {
        throw new Error(`Booking ${createWithdrawDto.bookingId} does not belong to vendor ${vendorId}`);
      }
    }

    // Check if a withdraw already exists for this booking
    const existingWithdraw = await this.withdrawRepository.findOne({
      where: { booking: { id: createWithdrawDto.bookingId } },
    });
    if (existingWithdraw) {
      throw new Error(`A withdraw request already exists for booking ${createWithdrawDto.bookingId}`);
    }

    let amount = 0;
    
    if (roleName === 'agent') {
      const agentCommission = Number(booking.service?.agent_commission_percentage || 0);
      amount = Number(booking.total_price) * (agentCommission / 100);
    } else {
      let commissionPct = requester?.commission_percentage || 0;
      const vendorSharePct = 100 - Number(commissionPct);
      amount = Number(booking.total_price) * (vendorSharePct / 100);
    }

    if (!amount || amount <= 0) {
      throw new Error(`Invalid withdrawal amount (Calculated amount: ${amount}). Ensure the booking has a total price greater than 0.`);
    }

    const withdraw = this.withdrawRepository.create({
      amount: amount,
      vendor: { id: vendorId },
      booking: createWithdrawDto.bookingId ? { id: createWithdrawDto.bookingId } : undefined,
      getway: createWithdrawDto.gatewayId ? { id: createWithdrawDto.gatewayId } : undefined,
    });
    const savedWithdraw = await this.withdrawRepository.save(withdraw);

    if (requester.phone) {
      const message = `Your withdraw request for BDT ${amount} has been submitted successfully.`;
      this.smsService.sendMessage(requester.phone, message).catch(err => {
        console.error('Failed to send SMS on withdraw creation:', err);
      });
    }

    // Send SMS to superadmins
    try {
      const superadmins = await this.userRepository.find({
        relations: { role: true },
        where: { role: { name: RoleType.SUPER_ADMIN } }
      });

      for (const admin of superadmins) {
        if (admin.phone) {
          const adminMessage = `New withdraw request for BDT ${amount} submitted by ${requester.name || 'Vendor/Agent'}.`;
          this.smsService.sendMessage(admin.phone, adminMessage).catch(err => {
            console.error(`Failed to send SMS to superadmin ${admin.phone}:`, err);
          });
        }
      }
    } catch (error) {
      console.error('Error fetching superadmins for SMS notification:', error);
    }

    return savedWithdraw;
  }

  async findAll() {
    return await this.withdrawRepository.find({
      relations: { 
        vendor: true, 
        booking: { service: true, user: true },
        getway: true,
      },
    });
  }

  async findByVendor(vendorId: number) {
    return await this.withdrawRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { 
        vendor: true, 
        booking: { service: true, user: true },
        getway: true,
      },
    });
  }

  async findOne(id: number) {
    const withdraw = await this.withdrawRepository.findOne({
      where: { id },
      relations: { 
        vendor: true, 
        booking: { service: true, user: true },
        getway: true,
      },
    });
    if (!withdraw) {
      throw new NotFoundException(`Withdraw with ID ${id} not found`);
    }
    return withdraw;
  }

  async updateStatus(id: number, status: WithdrawStatus, admin_note?: string) {
    const withdraw = await this.findOne(id);
    
    const savedWithdraw = await this.dataSource.transaction(async (manager) => {
      // If status is changed to APPROVED and it wasn't approved before
      if (status === WithdrawStatus.APPROVED && withdraw.status !== WithdrawStatus.APPROVED) {
        const vendor = await manager.findOne(User, { where: { id: withdraw.vendor.id } });
        if (vendor) {
          vendor.wallet_balance = Number(vendor.wallet_balance) + Number(withdraw.amount);
          await manager.save(vendor);
        }
      }
      
      withdraw.status = status;
      if (admin_note) {
        withdraw.admin_note = admin_note;
      }
      
      return await manager.save(withdraw);
    });

    if (status === WithdrawStatus.APPROVED) {
      const vendor = await this.userRepository.findOne({ where: { id: withdraw.vendor.id } });
      if (vendor && vendor.phone) {
        const message = `Your withdraw request for BDT ${withdraw.amount} has been approved.`;
        this.smsService.sendMessage(vendor.phone, message).catch(err => {
          console.error('Failed to send SMS on withdraw approval:', err);
        });
      }
      
      // Trigger Notification
      const msg = `Your withdraw request for BDT ${withdraw.amount} has been approved.`;
      if (withdraw.vendor?.id) {
        this.notificationService.createForUser(withdraw.vendor.id, msg, NotificationType.WITHDRAW).catch(e => console.error(e));
      }
    } else if (status === WithdrawStatus.REJECTED) {
      // Trigger Notification
      const msg = `Your withdraw request for BDT ${withdraw.amount} has been rejected.`;
      if (withdraw.vendor?.id) {
        this.notificationService.createForUser(withdraw.vendor.id, msg, NotificationType.WITHDRAW).catch(e => console.error(e));
      }
    }

    return savedWithdraw;
  }

  async remove(id: number) {
    const withdraw = await this.findOne(id);
    return await this.withdrawRepository.remove(withdraw);
  }
}
