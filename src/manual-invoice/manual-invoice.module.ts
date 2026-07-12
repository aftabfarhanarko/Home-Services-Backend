import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualInvoice } from './entities/manual-invoice.entity';
import { ManualCustomer } from './entities/manual-customer.entity';
import { ManualService } from './entities/manual-service.entity';
import { ManualInvoiceService } from './services/manual-invoice.service';
import { ManualInvoiceController } from './controllers/manual-invoice.controller';
import { ManualCustomerController } from './controllers/manual-customer.controller';
import { ManualServiceController } from './controllers/manual-service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManualInvoice, ManualCustomer, ManualService]),
  ],
  controllers: [
    ManualInvoiceController,
    ManualCustomerController,
    ManualServiceController,
  ],
  providers: [ManualInvoiceService],
  exports: [ManualInvoiceService],
})
export class ManualInvoiceModule {}
