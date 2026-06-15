import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  order: number;

  @ManyToOne(() => Category, category => category.children, { nullable: true, onDelete: 'SET NULL' })
  parent: Category | null;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
