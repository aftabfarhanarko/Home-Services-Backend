import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('help_articles')
export class HelpArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  titleBn: string;

  @Column('text')
  content: string;

  @Column('text')
  contentBn: string;

  @Column()
  category: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
