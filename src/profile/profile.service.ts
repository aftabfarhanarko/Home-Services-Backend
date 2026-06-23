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
    if (createProfileDto.category_ids && createProfileDto.category_ids.length > 0) {
      profileData.categories = createProfileDto.category_ids.map(id => ({ id }));
    }
    if (createProfileDto.devision_id) {
      profileData.devision = { id: createProfileDto.devision_id };
    }
    if (createProfileDto.district_id) {
      profileData.district = { id: createProfileDto.district_id };
    }
    if (createProfileDto.area_id) {
      profileData.area = { id: createProfileDto.area_id };
    }

    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  async findAll() {
    return await this.profileRepository.find({
      relations: { user: true, categories: true, devision: true, district: true, area: true },
    });
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: { user: true, categories: true, devision: true, district: true, area: true },
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
    if (updateProfileDto.category_ids !== undefined) {
      profile.categories = updateProfileDto.category_ids.length > 0 
        ? updateProfileDto.category_ids.map(id => ({ id } as any)) 
        : [];
    }
    if (updateProfileDto.devision_id !== undefined) {
      profile.devision = updateProfileDto.devision_id ? { id: updateProfileDto.devision_id } as any : null;
    }
    if (updateProfileDto.district_id !== undefined) {
      profile.district = updateProfileDto.district_id ? { id: updateProfileDto.district_id } as any : null;
    }
    if (updateProfileDto.area_id !== undefined) {
      profile.area = updateProfileDto.area_id ? { id: updateProfileDto.area_id } as any : null;
    }
    
    return await this.profileRepository.save(profile);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
