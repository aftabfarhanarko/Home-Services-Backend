import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ManualInvoiceService } from '../services/manual-invoice.service';

@UseGuards(JwtAuthGuard)
@Controller('api/manual-customers')
export class ManualCustomerController {
  constructor(private readonly manualInvoiceService: ManualInvoiceService) {}

  @Get()
  async findAll() {
    return await this.manualInvoiceService.findAllCustomers();
  }

  @Post()
  async createOrUpdate(@Body() body: any) {
    return await this.manualInvoiceService.createOrUpdateCustomer(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.manualInvoiceService.deleteCustomer(+id);
  }
}
