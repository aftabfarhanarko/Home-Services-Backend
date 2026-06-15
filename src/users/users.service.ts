import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByPhone(createUserDto.phone);
    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.roleId ? { id: createUserDto.roleId } as any : undefined,
      vendor: createUserDto.vendor_id ? { id: createUserDto.vendor_id } as any : undefined,
    });
    return this.userRepository.save(user);
  }

  async findEmployeesByVendor(vendorId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { role: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: { role: true } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone }, relations: { role: true } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const roleUpdate = updateUserDto.roleId ? { role: { id: updateUserDto.roleId } as any } : {};
    
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      ...roleUpdate,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(id, { refreshToken: refreshToken as any });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async markPhoneAsVerified(id: number): Promise<void> {
    await this.userRepository.update(id, { isPhoneVerified: true });
  }
}
