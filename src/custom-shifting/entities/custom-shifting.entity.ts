import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ShiftingStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('custom_shiftings')
export class CustomShifting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  shiftingType: string; // 'home' or 'office'

  @Column({ type: 'text' })
  sourceAddress: string;

  @Column({ type: 'text' })
  destinationAddress: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ShiftingStatus,
    default: ShiftingStatus.PENDING,
  })
  status: ShiftingStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
