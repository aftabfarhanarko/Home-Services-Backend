import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NestedService } from '../../nested-service/entities/nested-service.entity';
import { Package } from '../../package/entities/package.entity';

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

  @ManyToMany(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'booking_employees' })
  employees: User[];

  @ManyToOne(() => NestedService, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'nested_service_id' })
  nestedService: NestedService;

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  pkg: Package;

  @Column({ type: 'date' })
  date: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
