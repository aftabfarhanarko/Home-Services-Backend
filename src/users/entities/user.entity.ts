import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Service } from '../../service/entities/service.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @ManyToOne(() => User, user => user.employees, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @OneToMany(() => User, user => user.vendor)
  employees: User[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @Column({ type: 'varchar', nullable: true })
  vendor_unique_id: string | null;

  @ManyToMany(() => Service)
  @JoinTable({ name: 'user_saved_services' })
  savedServices: Service[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wallet_balance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commission_percentage: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
