import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import {
  Coupon,
  CouponApplicableTo,
  CouponDiscountType,
} from './entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const code = createCouponDto.code.trim().toUpperCase();
    const existing = await this.couponRepository.findOne({ where: { code } });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code,
      service: createCouponDto.service_id
        ? ({ id: createCouponDto.service_id } as any)
        : undefined,
      pkg: createCouponDto.package_id
        ? ({ id: createCouponDto.package_id } as any)
        : undefined,
    });

    return this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({
      relations: { service: true, pkg: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: { service: true, pkg: true },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.couponRepository.findOne({
      where: { code: code.trim().toUpperCase() },
      relations: { service: true, pkg: true },
    });
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    if (updateCouponDto.code) {
      const code = updateCouponDto.code.trim().toUpperCase();
      const existing = await this.couponRepository.findOne({ where: { code } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Coupon code already exists');
      }
      coupon.code = code;
    }

    Object.assign(coupon, {
      ...updateCouponDto,
      code: updateCouponDto.code
        ? updateCouponDto.code.trim().toUpperCase()
        : coupon.code,
      service:
        updateCouponDto.service_id !== undefined
          ? updateCouponDto.service_id
            ? ({ id: updateCouponDto.service_id } as any)
            : null
          : coupon.service,
      pkg:
        updateCouponDto.package_id !== undefined
          ? updateCouponDto.package_id
            ? ({ id: updateCouponDto.package_id } as any)
            : null
          : coupon.pkg,
    });

    return this.couponRepository.save(coupon);
  }

  async remove(id: number): Promise<void> {
    const result = await this.couponRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
  }

  calculateDiscount(coupon: Coupon, subtotal: number): number {
    const amount = Number(subtotal || 0);
    if (amount <= 0) return 0;

    let discount = 0;
    if (coupon.discount_type === CouponDiscountType.PERCENTAGE) {
      discount = (amount * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount) {
        discount = Math.min(discount, Number(coupon.max_discount));
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    return Math.min(discount, amount);
  }

  async validateCoupon(dto: ValidateCouponDto) {
    const coupon = await this.findByCode(dto.code);
    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    this.ensureCouponUsable(coupon, dto.subtotal, dto.service_id, dto.package_id);

    const discountAmount = this.calculateDiscount(coupon, dto.subtotal);
    const finalPrice = Math.max(Number(dto.subtotal) - discountAmount, 0);

    return {
      coupon,
      subtotal: Number(dto.subtotal),
      discount_amount: discountAmount,
      final_price: finalPrice,
    };
  }

  async applyCoupon(
    code: string,
    subtotal: number,
    serviceId?: number,
    packageId?: number,
  ) {
    const result = await this.validateCoupon({
      code,
      subtotal,
      service_id: serviceId,
      package_id: packageId,
    });

    await this.couponRepository.increment({ id: result.coupon.id }, 'used_count', 1);

    return result;
  }

  private ensureCouponUsable(
    coupon: Coupon,
    subtotal: number,
    serviceId?: number,
    packageId?: number,
  ) {
    if (!coupon.is_active) {
      throw new BadRequestException('This coupon is no longer active');
    }

    const today = new Date().toISOString().slice(0, 10);
    if (coupon.valid_from && coupon.valid_from > today) {
      throw new BadRequestException('This coupon is not valid yet');
    }
    if (coupon.valid_until && coupon.valid_until < today) {
      throw new BadRequestException('This coupon has expired');
    }

    if (coupon.usage_limit !== null && coupon.usage_limit !== undefined) {
      if (coupon.used_count >= coupon.usage_limit) {
        throw new BadRequestException('This coupon has reached its usage limit');
      }
    }

    if (Number(subtotal) < Number(coupon.min_order_amount || 0)) {
      throw new BadRequestException(
        `Minimum order amount of ৳${coupon.min_order_amount} required for this coupon`,
      );
    }

    if (coupon.applicable_to === CouponApplicableTo.SERVICE) {
      if (!serviceId || coupon.service?.id !== serviceId) {
        throw new BadRequestException('This coupon is not valid for the selected service');
      }
    }

    if (coupon.applicable_to === CouponApplicableTo.PACKAGE) {
      if (!packageId || coupon.pkg?.id !== packageId) {
        throw new BadRequestException('This coupon is not valid for the selected package');
      }
    }
  }
}
