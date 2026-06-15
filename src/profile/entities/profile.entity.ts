import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

export enum ProfileType {
  PERSONAL = 'personal',
  COMPANY = 'company',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProfileType,
    default: ProfileType.PERSONAL,
  })
  type: ProfileType;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // Work rating for personal, company rating for company

  @Column({ type: 'int', default: 0 })
  total_projects: number; // Total work done for personal, total projects for company

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Company specific fields
  @Column({ nullable: true })
  company_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_starting_price: number;

  @Column({ type: 'text', nullable: true })
  google_map_link: string;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
