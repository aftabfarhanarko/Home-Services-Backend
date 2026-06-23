import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Devision } from '../../devision/entities/devision.entity';
import { Area } from '../../area/entities/area.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  banglaName: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  @ManyToOne(() => Devision, devision => devision.districts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'devision_id' })
  devision: Devision;

  @OneToMany(() => Area, area => area.district)
  areas: Area[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
