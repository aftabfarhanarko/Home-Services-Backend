import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { Package } from '../../package/entities/package.entity';

export enum CouponDiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum CouponApplicableTo {
  ALL = 'all',
  SERVICE = 'service',
  PACKAGE = 'package',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CouponDiscountType,
    default: CouponDiscountType.PERCENTAGE,
  })
  discount_type: CouponDiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_amount: number;

  @Column({ type: 'int', nullable: true })
  usage_limit: number;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ type: 'date', nullable: true })
  valid_from: string;

  @Column({ type: 'date', nullable: true })
  valid_until: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: CouponApplicableTo,
    default: CouponApplicableTo.ALL,
  })
  applicable_to: CouponApplicableTo;

  @ManyToOne(() => Service, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  pkg: Package;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
