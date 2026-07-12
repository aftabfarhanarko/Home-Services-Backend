import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ManualInvoiceService } from '../services/manual-invoice.service';

@UseGuards(JwtAuthGuard)
@Controller('api/manual-invoices')
export class ManualInvoiceController {
  constructor(private readonly manualInvoiceService: ManualInvoiceService) {}

  // GET /api/manual-invoices — all active invoices
  @Get()
  async findAll() {
    return await this.manualInvoiceService.findAllInvoices();
  }

  // GET /api/manual-invoices/trash — trashed invoices (with auto-purge)
  @Get('trash')
  async findTrashed() {
    return await this.manualInvoiceService.findTrashedInvoices();
  }

  // GET /api/manual-invoices/:id — single invoice
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.manualInvoiceService.findOneInvoice(+id);
  }

  // POST /api/manual-invoices — create invoice
  @Post()
  async create(@Body() body: any) {
    return await this.manualInvoiceService.createInvoice(body);
  }

  // DELETE /api/manual-invoices/:id — soft delete (move to trash)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.manualInvoiceService.softDeleteInvoice(+id);
  }

  // PUT /api/manual-invoices/:id/restore — restore from trash
  @Put(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.manualInvoiceService.restoreInvoice(+id);
  }

  // DELETE /api/manual-invoices/:id/force — permanent delete
  @Delete(':id/force')
  async forceDelete(@Param('id') id: string) {
    return await this.manualInvoiceService.forceDeleteInvoice(+id);
  }

  // PUT /api/manual-invoices/:id/payment — update payment
  @Put(':id/payment')
  async updatePayment(@Param('id') id: string, @Body('amountPaid') amountPaid: number) {
    return await this.manualInvoiceService.updatePayment(+id, amountPaid);
  }
}
