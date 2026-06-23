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
      agent: createUserDto.agent_id ? { id: createUserDto.agent_id } as any : undefined,
    });
    return this.userRepository.save(user);
  }

  async findEmployeesByVendor(vendorId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { role: true, profile: { categories: true } },
    });
  }

  async findAll(user?: any): Promise<User[]> {
    if (user?.role === 'Vendor') {
      return this.userRepository.find({
        where: [
          { id: user.sub },
          { vendor: { id: user.sub } }
        ],
        relations: { role: true, profile: { categories: true }, vendor: true, agent: true }
      });
    } else if (user?.role === 'Agent') {
      return this.userRepository.find({
        where: [
          { id: user.sub },
          { agent: { id: user.sub } }
        ],
        relations: { role: true, profile: { categories: true }, vendor: true, agent: true }
      });
    } else if (user?.role === 'Super Admin' || user?.role === 'superadmin') {
      return this.userRepository.find({ relations: { role: true, profile: { categories: true }, vendor: true, agent: true } });
    }
    
    // Fallback for regular clients/users: only return their own profile
    if (user && user.sub) {
      return this.userRepository.find({
        where: { id: user.sub },
        relations: { role: true, profile: { categories: true }, vendor: true, agent: true }
      });
    }

    return [];
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: { role: true, profile: { categories: true } } 
    });
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

  async getSavedServices(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { savedServices: { category: true } },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.savedServices || [];
  }

  async toggleSavedService(userId: number, serviceId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { savedServices: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (!user.savedServices) {
      user.savedServices = [];
    }

    const isSaved = user.savedServices.some(s => s.id === serviceId);
    if (isSaved) {
      user.savedServices = user.savedServices.filter(s => s.id !== serviceId);
    } else {
      user.savedServices.push({ id: serviceId } as any);
    }

    await this.userRepository.save(user);
    return user.savedServices;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async markPhoneAsVerified(id: number): Promise<void> {
    await this.userRepository.update(id, { isPhoneVerified: true });
  }
}
