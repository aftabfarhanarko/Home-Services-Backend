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

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image1: string;

  @Column({ nullable: true })
  image2: string;

  @Column({ type: 'jsonb', nullable: true })
  faq: { question: string; answer: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
