import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { PrismaService } from 'src/prisma.service';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';

@Module({
  imports: [MediaModule],
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export default class InvoiceModule {}
