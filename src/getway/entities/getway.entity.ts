import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GetwayType {
  BKASH = 'bkash',
  NAGAD = 'nagad',
  ROCKET = 'rocket',
  BINANCE = 'binance',
  BANK = 'bank',
  VISA_CARD = 'visa_card',
}

@Entity('getways')
export class Getway {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: GetwayType,
  })
  getway_type: GetwayType;

  // JSON column to store dynamic info (account number, branch name, etc.)
  @Column({ type: 'jsonb', nullable: true })
  info: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
