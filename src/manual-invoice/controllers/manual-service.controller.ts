import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ManualInvoiceService } from '../services/manual-invoice.service';

@UseGuards(JwtAuthGuard)
@Controller('api/manual-services')
export class ManualServiceController {
  constructor(private readonly manualInvoiceService: ManualInvoiceService) {}

  @Get()
  async findAll() {
    return await this.manualInvoiceService.findAllServices();
  }

  @Post()
  async createOrUpdate(@Body() body: any) {
    return await this.manualInvoiceService.createOrUpdateService(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.manualInvoiceService.deleteService(+id);
  }
}
