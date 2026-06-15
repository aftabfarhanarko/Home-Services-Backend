import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Withdraw, WithdrawStatus } from './entities/withdraw.entity';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>,
  ) {}

  async create(createWithdrawDto: CreateWithdrawDto, vendorId: number) {
    const withdraw = this.withdrawRepository.create({
      ...createWithdrawDto,
      vendor: { id: vendorId },
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
    withdraw.status = status;
    return await this.withdrawRepository.save(withdraw);
  }

  async remove(id: number) {
    const withdraw = await this.findOne(id);
    return await this.withdrawRepository.remove(withdraw);
  }
}
