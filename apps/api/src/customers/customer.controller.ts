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
import { Request } from 'express';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import { CustomerFilterDto } from 'src/dtos/customers/customer-filter.dto';
import { PaginationFilterDto } from 'src/dtos/utils/pagination-result.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import CustomerService from './customer.service';

@Controller('customers')
@ApiBearerAuth()
export default class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('stats')
  @UseGuards(AccessTokenGuard)
  async getStats(
    @Query('months', ParseIntPipe) months: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.getStats(enterpriseId, months);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query()
    filter: PaginationFilterDto<CustomerFilterDto>,
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.findAll(enterpriseId, filter);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async create(@Body() model: CustomerCreateDto, @Req() req: Request) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.customerService.create(enterpriseId, model);
  }

  @UseGuards(AccessTokenGuard)
  @Get('count')
  async count(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.count(enterpriseId);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CustomerCreateDto,
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

  @Get(':year/stats')
  @UseGuards(AccessTokenGuard)
  async getStatsByYear(
    @Param('year', ParseIntPipe) year: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return await this.customerService.getStatsByYear(year, enterpriseId);
  }
}
