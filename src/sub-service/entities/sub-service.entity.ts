import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NestedService } from '../../nested-service/entities/nested-service.entity';

@Entity('sub_services')
export class SubService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NestedService, nestedService => nestedService.subServices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nested_service_id' })
  nestedService: NestedService;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
