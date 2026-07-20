import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomRequest, CustomRequestStatus } from './entities/custom-request.entity';
import { CreateCustomRequestDto } from './dto/create-custom-request.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CustomRequestService {
  constructor(
    @InjectRepository(CustomRequest)
    private readonly requestRepository: Repository<CustomRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateCustomRequestDto): Promise<CustomRequest> {
    const request = this.requestRepository.create({
      name: createDto.name,
      phone: createDto.phone,
      email: createDto.email,
      title: createDto.title,
      description: createDto.description,
      status: CustomRequestStatus.PENDING,
    });

    if (createDto.user_id) {
      const user = await this.userRepository.findOne({ where: { id: createDto.user_id } });
      if (user) {
        request.user = user;
      }
    }

    return await this.requestRepository.save(request);
  }

  async findAll(): Promise<CustomRequest[]> {
    return await this.requestRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CustomRequest> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!request) {
      throw new NotFoundException(`Custom request with ID ${id} not found`);
    }

    return request;
  }

  async updateStatus(id: number, status: CustomRequestStatus): Promise<CustomRequest> {
    const request = await this.findOne(id);
    request.status = status;
    return await this.requestRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);
  }
}
