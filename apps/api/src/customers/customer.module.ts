import { Module } from '@nestjs/common';
import ObjectiveService from 'src/objective/objective.service';
import { PrismaService } from 'src/prisma.service';
import CustomerController from './customer.controller';
import CustomerService from './customer.service';

@Module({
  imports: [],
  providers: [PrismaService, ObjectiveService, CustomerService],
  controllers: [CustomerController],
})
export default class CustomerModule {}
