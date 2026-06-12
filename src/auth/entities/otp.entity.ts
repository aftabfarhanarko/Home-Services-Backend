import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number; // Can be null if it's a new user verifying their phone

  @Column()
  phone: string;

  @Column()
  otpCode: string; // Hashed

  @Column({ default: 0 })
  attempts: number;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
