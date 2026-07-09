import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { PackageItem } from './package-item.entity';
import { Booking } from '../../booking/entities/booking.entity';


@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Service, service => service.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column("simple-array", { nullable: true })
  features: string[];

  @Column({ type: 'enum', enum: ['one_time', 'weekly', 'monthly'], default: 'one_time' })
  package_type: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  agent_commission_percentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  vendor_commission_percentage: number;

  @OneToMany(() => PackageItem, (item: PackageItem) => item.package, { cascade: true })
  items: PackageItem[];

  @OneToMany(() => Booking, (booking: Booking) => booking.pkg)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
