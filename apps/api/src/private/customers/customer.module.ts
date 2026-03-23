import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import InvoiceModule from 'private/invoices/invoice.module';
import MailingModule from 'private/mailing/mailing.module';
import NotificationModule from 'private/notifications/notification.module';
import ObjectiveService from 'private/objective/objective.service';
import ProjectModule from 'private/projects/project.module';
import CustomerController from './customer.controller';
import CustomerService from './customer.service';

@Module({
  imports: [MailingModule, ProjectModule, NotificationModule, InvoiceModule],
  providers: [PrismaService, ObjectiveService, CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export default class CustomerModule {}
