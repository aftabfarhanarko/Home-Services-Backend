import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualInvoice } from './entities/manual-invoice.entity';
import { ManualService } from './entities/manual-service.entity';
import { ManualInvoiceService } from './services/manual-invoice.service';
import { ManualInvoiceController } from './controllers/manual-invoice.controller';
import { ManualServiceController } from './controllers/manual-service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManualInvoice, ManualService]),
  ],
  controllers: [
    ManualInvoiceController,
    ManualServiceController,
  ],
  providers: [ManualInvoiceService],
  exports: [ManualInvoiceService],
})
export class ManualInvoiceModule {}
