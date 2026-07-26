import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('company_branding')
export class CompanyBranding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  footerLogoUrl: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  cityLocation: string;

  @Column({ type: 'text', nullable: true })
  facebookUrl: string;

  @Column({ type: 'text', nullable: true })
  instagramUrl: string;

  @Column({ type: 'text', nullable: true })
  twitterUrl: string;

  @Column({ type: 'text', nullable: true })
  linkedinUrl: string;

  @Column({ type: 'text', nullable: true })
  youtubeUrl: string;

  @Column({ type: 'text', nullable: true })
  whatsappNumber: string;

  @Column({ type: 'text', nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  footerDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
