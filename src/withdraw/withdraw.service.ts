import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw, WithdrawStatus } from './entities/withdraw.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createWithdrawDto: CreateWithdrawDto, vendorId: number) {
    let amount = createWithdrawDto.amount;

    if (createWithdrawDto.bookingId) {
      const booking = await this.bookingRepository.findOne({ 
        where: { id: createWithdrawDto.bookingId },
        relations: { service: true }
      });
      const vendor = await this.userRepository.findOne({ 
        where: { id: vendorId },
        relations: { role: true }
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${createWithdrawDto.bookingId} not found`);
      }
      
      let commissionPct = vendor?.commission_percentage || 0;
      
      // If user is an Agent, use the specific service's agent commission percentage
      if (vendor?.role?.name?.toLowerCase() === 'agent' && booking.service) {
        commissionPct = booking.service.agent_commission_percentage || 0;
      }
      
      amount = Number(booking.total_price) * (Number(commissionPct) / 100);
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid withdrawal amount. Commission is zero or not provided.');
    }

    const withdraw = this.withdrawRepository.create({
      amount: amount,
      vendor: { id: vendorId },
      booking: createWithdrawDto.bookingId ? { id: createWithdrawDto.bookingId } : undefined,
    });
    return await this.withdrawRepository.save(withdraw);
  }

  async findAll() {
    return await this.withdrawRepository.find({
      relations: { vendor: true },
    });
  }

  async findByVendor(vendorId: number) {
    return await this.withdrawRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { vendor: true },
    });
  }

  async findOne(id: number) {
    const withdraw = await this.withdrawRepository.findOne({
      where: { id },
      relations: { vendor: true },
    });
    if (!withdraw) {
      throw new NotFoundException(`Withdraw with ID ${id} not found`);
    }
    return withdraw;
  }

  async updateStatus(id: number, status: WithdrawStatus) {
    const withdraw = await this.findOne(id);
    
    // If status is changed to APPROVED and it wasn't approved before
    if (status === WithdrawStatus.APPROVED && withdraw.status !== WithdrawStatus.APPROVED) {
      const vendor = await this.userRepository.findOne({ where: { id: withdraw.vendor.id } });
      if (vendor) {
        vendor.wallet_balance = Number(vendor.wallet_balance) + Number(withdraw.amount);
        await this.userRepository.save(vendor);
      }
    }
    
    withdraw.status = status;
    return await this.withdrawRepository.save(withdraw);
  }

  async remove(id: number) {
    const withdraw = await this.findOne(id);
    return await this.withdrawRepository.remove(withdraw);
  }
}
