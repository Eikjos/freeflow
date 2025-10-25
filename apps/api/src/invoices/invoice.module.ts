import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import ObjectiveModule from 'src/objective/objective.module';
import { PrismaService } from 'src/prisma.service';
import { SalesModule } from 'src/sales/sales.module';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';

@Module({
  imports: [MediaModule, ObjectiveModule, SalesModule],
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export default class InvoiceModule {}
