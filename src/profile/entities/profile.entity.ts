import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Devision } from '../../devision/entities/devision.entity';
import { District } from '../../district/entities/district.entity';
import { Area } from '../../area/entities/area.entity';

export enum ProfileType {
  PERSONAL = 'personal',
  COMPANY = 'company',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
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

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => Devision, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'devision_id' })
  devision: Devision;

  @ManyToOne(() => District, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Area, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Company specific fields
  @Column({ nullable: true })
  company_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_starting_price: number;

  @Column({ type: 'text', nullable: true })
  google_map_link: string;

  @Column({ nullable: true })
  shop_image1: string;

  @Column({ nullable: true })
  shop_image2: string;

  @Column({ nullable: true })
  nid_number: string;

  @Column({ nullable: true })
  nid_front: string;

  @Column({ nullable: true })
  nid_back: string;

  @ManyToMany(() => Category, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'profile_categories',
    joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
