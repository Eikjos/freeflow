import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import MailingModule from 'private/mailing/mailing.module';
import { MediaModule } from 'private/media/media.module';
import NotificationModule from 'private/notifications/notification.module';
import ObjectiveModule from 'private/objective/objective.module';
import { SalesModule } from 'private/sales/sales.module';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';
import InvoiceFileService from './invoice-file.service';

@Module({
  imports: [
    MediaModule,
    ObjectiveModule,
    SalesModule,
    MailingModule,
    NotificationModule,
  ],
  providers: [PrismaService, InvoiceService, InvoiceFileService],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export default class InvoiceModule {}
