import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import SalesService from './sales.service';

@Controller('sales')
@ApiBearerAuth()
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query('year', ParseIntPipe) year: number,
    @Req() req: Request,
  ) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.salesService.findAllByYear(year, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('previsions')
  async getPrevisions(@Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.salesService.getPrevisions(enterpriseId);
  }
}
