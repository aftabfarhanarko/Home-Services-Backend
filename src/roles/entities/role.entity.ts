import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../enums/permission.enum';

export enum RoleType {
  SUPER_ADMIN = 'Super Admin',
  AGENT = 'Agent',
  VENDOR = 'Vendor',
  EMPLOYEE = 'Employee',
  CLIENT = 'Client',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    unique: true,
  })
  name: RoleType;

  @Column({
    type: 'enum',
    enum: Permission,
    array: true,
    default: [],
  })
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
