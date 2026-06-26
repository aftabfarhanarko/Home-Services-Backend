import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    const data = await this.couponService.create(createCouponDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Coupon created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.couponService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupons retrieved successfully',
      data,
    };
  }

  @Public()
  @Post('validate')
  async validate(@Body() validateCouponDto: ValidateCouponDto) {
    const data = await this.couponService.validateCoupon(validateCouponDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon applied successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.couponService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const data = await this.couponService.update(+id, updateCouponDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon deleted successfully',
    };
  }
}
