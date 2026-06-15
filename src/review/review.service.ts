import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number) {
    const reviewData: any = {
      ...createReviewDto,
      user: { id: userId },
      service: { id: createReviewDto.service_id },
    };
    if (createReviewDto.nested_service_id) {
      reviewData.nestedService = { id: createReviewDto.nested_service_id };
    }
    const review = this.reviewRepository.create(reviewData);
    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({
      relations: { user: true, service: true, nestedService: true },
    });
  }

  async findByService(serviceId: number) {
    return await this.reviewRepository.find({
      where: { service: { id: serviceId } },
      relations: { user: true, nestedService: true },
    });
  }

  async findByNestedService(nestedServiceId: number) {
    return await this.reviewRepository.find({
      where: { nestedService: { id: nestedServiceId } },
      relations: { user: true, service: true },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { user: true, service: true, nestedService: true },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return await this.reviewRepository.remove(review);
  }
}
