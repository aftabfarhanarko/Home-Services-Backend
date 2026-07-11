import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { SmsService } from '../sms/sms.service';

const USER_PROFILE_RELATIONS = {
  categories: true,
  devision: true,
  district: { devision: true },
  area: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly smsService: SmsService,
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
    const savedUser = await this.userRepository.save(user);

    if (createUserDto.roleId) {
      const savedUserWithRole = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: { role: true },
      });
      if (savedUserWithRole?.role?.name?.toLowerCase() === 'super admin' || savedUserWithRole?.role?.name?.toLowerCase() === 'superadmin') {
        const message = `You have been added as a Super Admin on Rajseba. You can login using your phone number: ${savedUser.phone}`;
        this.smsService.sendMessage(savedUser.phone, message).catch(err => {
          console.error(`Failed to send Super Admin creation SMS to ${savedUser.phone}:`, err);
        });
      }
    }

    return savedUser;
  }

  async findEmployeesByVendor(vendorId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { vendor: { id: vendorId } },
      relations: { role: true, profile: USER_PROFILE_RELATIONS },
    });
  }

  async findAll(user?: any, roleFilter?: string): Promise<User[]> {
    const whereRole: any = roleFilter ? { role: { name: roleFilter } } : {};

    if (user?.role?.toLowerCase() === 'vendor') {
      const vendorWhere: any = [
        { id: user.sub, ...whereRole },
        { vendor: { id: user.sub }, ...whereRole }
      ];
      return this.userRepository.find({
        where: vendorWhere,
        relations: { role: true, profile: USER_PROFILE_RELATIONS, vendor: true, agent: true }
      });
    } else if (user?.role?.toLowerCase() === 'agent') {
      const agentWhere: any = [
        { id: user.sub, ...whereRole },
        { agent: { id: user.sub }, ...whereRole }
      ];
      return this.userRepository.find({ 
        where: agentWhere,
        relations: { role: true, profile: USER_PROFILE_RELATIONS, vendor: true, agent: true } 
      });
    } else if (user?.role?.toLowerCase() === 'super admin' || user?.role?.toLowerCase() === 'superadmin') {
      const adminWhere: any = Object.keys(whereRole).length > 0 ? whereRole : undefined;
      return this.userRepository.find({ 
        where: adminWhere,
        relations: { role: true, profile: USER_PROFILE_RELATIONS, vendor: true, agent: true } 
      });
    }
    
    // Fallback for regular clients/users: only return their own profile
    if (user && user.sub) {
      const fallbackWhere: any = { id: user.sub, ...whereRole };
      return this.userRepository.find({
        where: fallbackWhere,
        relations: { role: true, profile: USER_PROFILE_RELATIONS, vendor: true, agent: true }
      });
    }

    return [];
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: { role: true, profile: USER_PROFILE_RELATIONS } 
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone }, relations: { role: true } });
  }

  async findByRoleName(roleName: string): Promise<User[]> {
    return this.userRepository.find({
      where: { role: { name: roleName as any } },
      relations: { role: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const wasInactive = existingUser.status !== 'active';
    const roleUpdate = updateUserDto.roleId ? { role: { id: updateUserDto.roleId } as any } : {};
    
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      ...roleUpdate,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const savedUser = await this.userRepository.save(user);

    if (wasInactive && savedUser.status === 'active' && savedUser.phone) {
      const roleName = existingUser.role?.name?.toLowerCase() || '';
      if (roleName === 'vendor' || roleName === 'agent') {
        const message = `Congratulations! Your Rajseba account has been activated. Please login to your dashboard to manage your activities.`;
        this.smsService.sendMessage(savedUser.phone, message).catch(err => {
          console.error(`Failed to send activation SMS to ${savedUser.phone}:`, err);
        });
      }
    }

    return savedUser;
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

  async updateUserWallet(userId: number, amount: number): Promise<void> {
    const user = await this.findOne(userId);
    user.wallet_balance = Number(user.wallet_balance || 0) + Number(amount);
    await this.userRepository.save(user);
  }
}
