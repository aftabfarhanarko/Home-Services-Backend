import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NestedService } from '../../nested-service/entities/nested-service.entity';
import { SubService } from '../../sub-service/entities/sub-service.entity';
import { Package } from '../../package/entities/package.entity';
import { Service } from '../../service/entities/service.entity';

export enum BookingStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  ON_THE_WAY = 'on_the_way',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @ManyToMany(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'booking_employees' })
  employees: User[];

  @ManyToMany(() => SubService, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'booking_sub_services' })
  subServices: SubService[];

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  pkg: Package;

  @ManyToOne(() => Service, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'jsonb', nullable: true })
  sub_service_items: { sub_service_id: number; quantity: number }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  coupon_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_price: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time: string;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  onTheWayAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
