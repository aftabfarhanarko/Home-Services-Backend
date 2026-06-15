import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { NestedService } from '../../nested-service/entities/nested-service.entity';
import { Package } from '../../package/entities/package.entity';
import { User } from '../../users/entities/user.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @OneToMany(() => NestedService, nestedService => nestedService.service)
  nestedServices: NestedService[];

  @OneToMany(() => Package, pkg => pkg.service)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
