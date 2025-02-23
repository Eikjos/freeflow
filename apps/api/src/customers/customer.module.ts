import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import CustomerController from './customer.controller';
import CustomerService from './customer.service';

@Module({
  imports: [],
  providers: [PrismaService, CustomerService],
  controllers: [CustomerController],
})
export default class CustomerModule {}
