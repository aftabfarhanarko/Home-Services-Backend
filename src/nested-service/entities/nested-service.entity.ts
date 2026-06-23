import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { SubService } from 'src/sub-service/entities/sub-service.entity';


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
  starting_price: number;

  @OneToMany(() => SubService, subService => subService.nestedService, { cascade: true })
  subServices: SubService[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
