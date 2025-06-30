import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';

@Module({
  imports: [],
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export default class InvoiceModule {}
