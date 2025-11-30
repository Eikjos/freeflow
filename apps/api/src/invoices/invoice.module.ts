import { Module } from '@nestjs/common';
import MailingModule from 'mailing/mailing.module';
import { MediaModule } from 'media/media.module';
import ObjectiveModule from 'objective/objective.module';
import { PrismaService } from 'prisma.service';
import { SalesModule } from 'sales/sales.module';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';

@Module({
  imports: [MediaModule, ObjectiveModule, SalesModule, MailingModule],
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export default class InvoiceModule {}
