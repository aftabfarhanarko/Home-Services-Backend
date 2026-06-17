import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../../service/entities/service.entity';

@Entity('nested_services')
export class NestedService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Service, service => service.nestedServices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;



  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
