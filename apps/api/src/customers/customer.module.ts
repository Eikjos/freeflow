import { Module } from '@nestjs/common'
import MailingModule from 'mailing/mailing.module'
import ObjectiveService from 'objective/objective.service'
import { PrismaService } from 'prisma.service'
import ProjectModule from 'projects/project.module'
import CustomerController from './customer.controller'
import CustomerService from './customer.service'

@Module({
  imports: [MailingModule, ProjectModule],
  providers: [PrismaService, ObjectiveService, CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export default class CustomerModule {}
