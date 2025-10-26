import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import SalesService from './sales.service';

@Controller('sales')
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query('year', new ParseIntPipe()) year: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.salesService.findAllByYear(year, enterpriseId);
  }
}
