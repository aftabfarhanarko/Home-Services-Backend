import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

const PROFILE_RELATIONS = {
  user: true,
  categories: true,
  devision: true,
  district: { devision: true },
  area: true,
} as const;

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  private applyRelationFields(
    profile: Profile,
    dto: Pick<CreateProfileDto, 'user_id' | 'category_ids' | 'devision_id' | 'district_id' | 'area_id'>,
  ) {
    if (dto.user_id !== undefined) {
      profile.user = { id: dto.user_id } as any;
    }
    if (dto.category_ids !== undefined) {
      profile.categories = dto.category_ids.length > 0
        ? dto.category_ids.map((id) => ({ id } as any))
        : [];
    }
    if (dto.devision_id !== undefined) {
      profile.devision = dto.devision_id ? ({ id: dto.devision_id } as any) : null;
    }
    if (dto.district_id !== undefined) {
      profile.district = dto.district_id ? ({ id: dto.district_id } as any) : null;
    }
    if (dto.area_id !== undefined) {
      profile.area = dto.area_id ? ({ id: dto.area_id } as any) : null;
    }
  }

  async create(createProfileDto: CreateProfileDto) {
    const {
      user_id,
      category_ids,
      devision_id,
      district_id,
      area_id,
      ...scalarFields
    } = createProfileDto;

    const profile = this.profileRepository.create(scalarFields);
    this.applyRelationFields(profile, {
      user_id,
      category_ids,
      devision_id,
      district_id,
      area_id,
    });

    const saved = await this.profileRepository.save(profile);
    return this.findOne(saved.id);
  }

  async findAll() {
    return await this.profileRepository.find({
      relations: PROFILE_RELATIONS,
    });
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: PROFILE_RELATIONS,
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);

    const {
      user_id,
      category_ids,
      devision_id,
      district_id,
      area_id,
      ...scalarFields
    } = updateProfileDto;

    Object.assign(profile, scalarFields);
    this.applyRelationFields(profile, {
      user_id,
      category_ids,
      devision_id,
      district_id,
      area_id,
    });

    await this.profileRepository.save(profile);
    return this.findOne(id);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
