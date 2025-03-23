import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomerCreateValidation, CustomerModel } from '@repo/shared-types';
import { Request } from 'express';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ZodPipe } from 'src/pipe/zod.pipe';
import CustomerService from './customer.service';
import { PaginationFilterDto } from 'src/dtos/utils/pagination-result.dto';

@Controller('customers')
@ApiBearerAuth()
export default class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query() filter: PaginationFilterDto<CustomerModel>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findAll(enterpriseId, filter);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async create(
    @Body(new ZodPipe(CustomerCreateValidation)) model: CustomerCreateDto,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.create(enterpriseId, model);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(CustomerCreateValidation)) model: CustomerCreateDto,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.update(id, enterpriseId, model);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findByIdAndEnterpriseId(id, enterpriseId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.delete(id, enterpriseId);
  }
}
