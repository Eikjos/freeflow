import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomerCreateValidation } from '@repo/shared-types';
import { Request } from 'express';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ZodPipe } from 'src/pipe/zod.pipe';
import CustomerService from './customer.service';

@Controller('customers')
export default class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query() page: number,
    @Query() pageSize: number,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findAll(enterpriseId, page, pageSize);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async create(
    @Body(new ZodPipe(CustomerCreateValidation)) model: CustomerCreateDto,
    @Req() req: Request,
  ) {
    const entepriseId = req.user['enterpriseId'];
    return await this.customerService.create(entepriseId, model);
  }
}
