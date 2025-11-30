import { Module } from '@nestjs/common';
import MailingModule from 'mailing/mailing.module';
import ObjectiveService from 'objective/objective.service';
import { PrismaService } from 'prisma.service';
import CustomerController from './customer.controller';
import CustomerService from './customer.service';

@Module({
  imports: [MailingModule],
  providers: [PrismaService, ObjectiveService, CustomerService],
  controllers: [CustomerController],
})
export default class CustomerModule {}
