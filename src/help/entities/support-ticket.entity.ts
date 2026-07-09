import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticketId: string; // readable ticket ID e.g., TKT-1024

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  subject: string;

  @Column()
  category: string; // booking, payment, account, other

  @Column({ default: 'medium' })
  priority: string; // low, medium, high

  @Column({ default: 'pending' })
  status: string; // pending, in_progress, resolved

  @Column('text')
  description: string;

  @Column('jsonb', { default: [] })
  replies: {
    sender: 'user' | 'agent' | 'admin';
    name: string;
    message: string;
    createdAt: Date;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
