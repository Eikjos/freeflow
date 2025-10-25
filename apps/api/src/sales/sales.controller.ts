import { Controller, Get, ParseIntPipe, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import SalesService from './sales.service';

@Controller('sales')
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async findAll(@Query(ParseIntPipe) year: number, @Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.salesService.findAllByYear(year, enterpriseId);
  }
}
