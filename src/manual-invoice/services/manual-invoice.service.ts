import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan } from 'typeorm';
import { ManualInvoice, PaymentStatus } from '../entities/manual-invoice.entity';
import { ManualCustomer } from '../entities/manual-customer.entity';
import { ManualService } from '../entities/manual-service.entity';

@Injectable()
export class ManualInvoiceService {
  constructor(
    @InjectRepository(ManualInvoice)
    private readonly invoiceRepo: Repository<ManualInvoice>,
    @InjectRepository(ManualCustomer)
    private readonly customerRepo: Repository<ManualCustomer>,
    @InjectRepository(ManualService)
    private readonly serviceRepo: Repository<ManualService>,
  ) {}

  // ==========================================
  // INVOICE SERVICE METHODS
  // ==========================================

  async findAllInvoices(): Promise<ManualInvoice[]> {
    return await this.invoiceRepo.find({
      where: { status: Not('trashed') },
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findTrashedInvoices(): Promise<ManualInvoice[]> {
    // Dynamic purging: Delete invoices soft-deleted more than 14 days ago
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    try {
      await this.invoiceRepo.delete({
        status: 'trashed',
        deletedAt: LessThan(fourteenDaysAgo),
      });
    } catch (err) {
      console.error('Failed to dynamically purge expired trashed invoices:', err);
    }

    return await this.invoiceRepo.find({
      where: { status: 'trashed' },
      order: {
        deletedAt: 'DESC',
        date: 'DESC',
      },
    });
  }

  async findOneInvoice(id: number): Promise<ManualInvoice> {
    const invoice = await this.invoiceRepo.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async createInvoice(dto: any): Promise<ManualInvoice> {
    const {
      invoiceNumber,
      date,
      customer,
      items,
      totalAmount,
      discount,
      totalPayableAmount,
      amountInWords,
      templateName,
      paymentOptions,
      signeeName,
      signeeRole,
      paidAmount,
      dueAmount,
      paymentStatus,
    } = dto;

    if (!invoiceNumber || !customer || !items || items.length === 0 || !amountInWords) {
      throw new BadRequestException('Invoice number, customer, items, and amount in words are required');
    }

    // 1. Dynamic Customer Upsert
    if (customer.name && customer.phone && customer.address) {
      const phoneTrim = customer.phone.trim();
      const existingCustomer = await this.customerRepo.findOne({ where: { phone: phoneTrim } });
      if (existingCustomer) {
        existingCustomer.name = customer.name.trim();
        existingCustomer.email = customer.email ? customer.email.trim() : '';
        existingCustomer.address = customer.address.trim();
        await this.customerRepo.save(existingCustomer);
      } else {
        const newCustomer = this.customerRepo.create({
          name: customer.name.trim(),
          phone: phoneTrim,
          email: customer.email ? customer.email.trim() : '',
          address: customer.address.trim(),
        });
        await this.customerRepo.save(newCustomer);
      }
    }

    // 2. Dynamic Service Upsert
    for (const item of items) {
      if (item.description && item.rate > 0) {
        const nameTrim = item.description.trim();
        const existingService = await this.serviceRepo.findOne({ where: { name: nameTrim } });
        if (existingService) {
          existingService.rate = Number(item.rate);
          await this.serviceRepo.save(existingService);
        } else {
          const newService = this.serviceRepo.create({
            name: nameTrim,
            rate: Number(item.rate),
          });
          await this.serviceRepo.save(newService);
        }
      }
    }

    // Check if invoice number already exists
    const existingInvoiceNumber = await this.invoiceRepo.findOne({ where: { invoiceNumber: invoiceNumber.trim() } });
    if (existingInvoiceNumber) {
      throw new BadRequestException(`Invoice number "${invoiceNumber}" already exists.`);
    }

    // 3. Create and Save the Invoice
    const invoice = this.invoiceRepo.create({
      invoiceNumber: invoiceNumber.trim(),
      date: date ? new Date(date) : new Date(),
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        address: customer.address.trim(),
      },
      items: items.map((item: any) => ({
        description: item.description.trim(),
        qty: Number(item.qty),
        rate: Number(item.rate),
        amount: Number(item.amount || item.qty * item.rate),
      })),
      totalAmount: Number(totalAmount || items.reduce((acc: number, curr: any) => acc + curr.qty * curr.rate, 0)),
      discount: Number(discount || 0),
      totalPayableAmount: Number(totalPayableAmount || items.reduce((acc: number, curr: any) => acc + curr.qty * curr.rate, 0)),
      amountInWords: amountInWords.trim(),
      templateName: templateName || 'template1',
      paymentOptions: paymentOptions || {
        accountName: 'RAJSEBA.COM',
        accountNumber: '02433002451',
        bankName: 'Bank Asia PLC',
        branch: 'Rajshahi Branch',
        routingNumber: '070811937',
      },
      signeeName: signeeName ? signeeName.trim() : 'Ariful Islam Arif',
      signeeRole: signeeRole ? signeeRole.trim() : 'CEO, Rajseba Design Studio',
      paidAmount: Number(paidAmount) || 0,
      dueAmount: Number(dueAmount) || 0,
      paymentStatus: paymentStatus || PaymentStatus.DUE,
      status: 'active',
    });

    return await this.invoiceRepo.save(invoice);
  }

  async softDeleteInvoice(id: number): Promise<{ message: string }> {
    const invoice = await this.findOneInvoice(id);
    invoice.status = 'trashed';
    invoice.deletedAt = new Date();
    await this.invoiceRepo.save(invoice);
    return { message: 'Invoice moved to trash successfully' };
  }

  async restoreInvoice(id: number): Promise<{ message: string; invoice: ManualInvoice }> {
    const invoice = await this.findOneInvoice(id);
    invoice.status = 'active';
    invoice.deletedAt = null;
    const restored = await this.invoiceRepo.save(invoice);
    return { message: 'Invoice restored successfully', invoice: restored };
  }

  async forceDeleteInvoice(id: number): Promise<{ message: string }> {
    const invoice = await this.findOneInvoice(id);
    await this.invoiceRepo.remove(invoice);
    return { message: 'Invoice permanently deleted' };
  }

  async updatePayment(id: number, amountPaid: number): Promise<ManualInvoice> {
    const invoice = await this.findOneInvoice(id);
    const paymentValue = Number(amountPaid);

    if (isNaN(paymentValue) || paymentValue <= 0) {
      throw new BadRequestException('Invalid payment amount. Must be a positive number.');
    }

    const currentPaid = Number(invoice.paidAmount || 0);
    const total = Number(invoice.totalPayableAmount || invoice.totalAmount);

    const newPaid = Math.min(total, currentPaid + paymentValue);
    const newDue = Math.max(0, total - newPaid);
    const newStatus = newDue === 0 ? PaymentStatus.PAID : PaymentStatus.DUE;

    invoice.paidAmount = newPaid;
    invoice.dueAmount = newDue;
    invoice.paymentStatus = newStatus;

    return await this.invoiceRepo.save(invoice);
  }

  // ==========================================
  // CUSTOMER SERVICE METHODS
  // ==========================================

  async findAllCustomers(): Promise<ManualCustomer[]> {
    return await this.customerRepo.find({
      order: { name: 'ASC' },
    });
  }

  async createOrUpdateCustomer(dto: any): Promise<ManualCustomer> {
    const { name, phone, email, address } = dto;
    if (!name || !phone || !address) {
      throw new BadRequestException('Name, phone, and address are required');
    }

    const phoneTrim = phone.trim();
    let customer = await this.customerRepo.findOne({ where: { phone: phoneTrim } });
    if (customer) {
      customer.name = name.trim();
      customer.email = email ? email.trim() : '';
      customer.address = address.trim();
      return await this.customerRepo.save(customer);
    } else {
      customer = this.customerRepo.create({
        name: name.trim(),
        phone: phoneTrim,
        email: email ? email.trim() : '',
        address: address.trim(),
      });
      return await this.customerRepo.save(customer);
    }
  }

  async deleteCustomer(id: number): Promise<{ message: string }> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    await this.customerRepo.remove(customer);
    return { message: 'Customer deleted successfully' };
  }

  // ==========================================
  // SERVICE SERVICE METHODS
  // ==========================================

  async findAllServices(): Promise<ManualService[]> {
    return await this.serviceRepo.find({
      order: { name: 'ASC' },
    });
  }

  async createOrUpdateService(dto: any): Promise<ManualService> {
    const { name, rate } = dto;
    if (!name || rate === undefined) {
      throw new BadRequestException('Service name and rate are required');
    }

    const nameTrim = name.trim();
    let service = await this.serviceRepo.findOne({ where: { name: nameTrim } });
    if (service) {
      service.rate = Number(rate);
      return await this.serviceRepo.save(service);
    } else {
      service = this.serviceRepo.create({
        name: nameTrim,
        rate: Number(rate),
      });
      return await this.serviceRepo.save(service);
    }
  }

  async deleteService(id: number): Promise<{ message: string }> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    await this.serviceRepo.remove(service);
    return { message: 'Service deleted successfully' };
  }
}
