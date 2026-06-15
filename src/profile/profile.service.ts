import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const profileData: any = { ...createProfileDto };
    
    if (createProfileDto.user_id) {
      profileData.user = { id: createProfileDto.user_id };
    }
    if (createProfileDto.category_id) {
      profileData.category = { id: createProfileDto.category_id };
    }

    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  async findAll() {
    return await this.profileRepository.find({
      relations: { user: true, category: true },
    });
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);
    
    Object.assign(profile, updateProfileDto);
    
    if (updateProfileDto.user_id) {
      profile.user = { id: updateProfileDto.user_id } as any;
    }
    if (updateProfileDto.category_id !== undefined) {
      profile.category = updateProfileDto.category_id ? { id: updateProfileDto.category_id } as any : null;
    }
    
    return await this.profileRepository.save(profile);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
