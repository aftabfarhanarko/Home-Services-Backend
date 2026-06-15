import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const userId = 1; // placeholder: use @Request() req, req.user.id
    const data = await this.reviewService.create(createReviewDto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Review created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.reviewService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Reviews retrieved successfully',
      data,
    };
  }

  @Get('service/:serviceId')
  async findByService(@Param('serviceId') serviceId: string) {
    const data = await this.reviewService.findByService(+serviceId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Reviews by service retrieved successfully',
      data,
    };
  }

  @Get('nested-service/:nestedServiceId')
  async findByNestedService(@Param('nestedServiceId') nestedServiceId: string) {
    const data = await this.reviewService.findByNestedService(+nestedServiceId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Reviews by nested service retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.reviewService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Review retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    const data = await this.reviewService.update(+id, updateReviewDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Review updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Review deleted successfully',
    };
  }
}
