import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { PackageItem } from './package-item.entity';


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

  @OneToMany(() => PackageItem, (item: PackageItem) => item.package, { cascade: true })
  items: PackageItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
