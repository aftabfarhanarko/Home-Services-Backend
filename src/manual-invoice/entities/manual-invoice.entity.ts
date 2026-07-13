import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum PaymentStatus {
  PAID = 'Paid',
  DUE = 'Due',
}

export enum TemplateName {
  TEMPLATE1 = 'template1',
  TEMPLATE2 = 'template2',
}

@Entity('manual_invoices')
export class ManualInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  invoiceNumber: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'jsonb' })
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };

  @Column({ type: 'jsonb' })
  items: {
    description: string;
    qty: number;
    rate: number;
    amount: number;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPayableAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dueAmount: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: PaymentStatus.DUE,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 255 })
  amountInWords: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: TemplateName.TEMPLATE1,
  })
  templateName: TemplateName;

  @Column({ type: 'jsonb', nullable: true })
  paymentOptions: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
    routingNumber: string;
  };

  @Column({ type: 'varchar', length: 255, default: 'Ariful Islam Arif' })
  signeeName: string;

  @Column({ type: 'varchar', length: 255, default: 'CEO, Rajseba Design Studio' })
  signeeRole: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
