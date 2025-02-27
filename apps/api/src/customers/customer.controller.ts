import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomerCreateValidation } from '@repo/shared-types';
import { Request } from 'express';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ZodPipe } from 'src/pipe/zod.pipe';
import CustomerService from './customer.service';

@Controller('customers')
@ApiBearerAuth()
export default class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
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
