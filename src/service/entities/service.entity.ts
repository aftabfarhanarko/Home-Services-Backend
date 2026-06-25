import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { NestedService } from '../../nested-service/entities/nested-service.entity';
import { Package } from '../../package/entities/package.entity';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'jsonb', nullable: true })
  faq: { question: string; answer: string }[];

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  agent_commission_percentage: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'service_employees' })
  employees: User[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @ManyToOne(() => Category, category => category.services, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => NestedService, nestedService => nestedService.service)
  nestedServices: NestedService[];

  @OneToMany(() => Package, pkg => pkg.service)
  packages: Package[];

  @OneToMany(() => Booking, booking => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.service)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
