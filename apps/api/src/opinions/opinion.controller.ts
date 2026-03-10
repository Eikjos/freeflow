import {
  Body,
  Controller,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import CreateOpinionDto from 'dtos/opinions/create-opinion.dto';
import { Request } from 'express';
import { CustomerGuard } from 'guards/customer.guard';
import OpinionService from './opinion.service';

@Controller('opinions')
export default class OpinionController {
  constructor(private readonly opinionService: OpinionService) {}

  @UseGuards(CustomerGuard)
  @Post()
  @HttpCode(200)
  create(
    @Query('enterpriseId', ParseIntPipe) enterpriseId: number,
    @Body() model: CreateOpinionDto,
    @Req() req: Request,
  ) {
    const customerId = parseInt(req.user['customerId']);
    return this.opinionService.create(model, customerId, enterpriseId);
  }
}
