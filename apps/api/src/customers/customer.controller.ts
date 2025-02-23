import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import CustomerService from './customer.service';

@Controller('customers')
export default class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(
    @Query() page: number,
    @Query() pageSize: number,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findAll(enterpriseId, page, pageSize);
  }
}
