import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnterpriseOrCustomerGuard } from 'guards/enterprise-customer.guard';
import JuridicShapeService from './juridic-shapes.service';

@Controller('juridic-shapes')
@ApiTags('Juridic Shape')
@ApiBearerAuth()
export default class JuridicShapesController {
  constructor(private readonly juridicShapeService: JuridicShapeService) {}

  @Get()
  @UseGuards(EnterpriseOrCustomerGuard)
  findAll() {
    return this.juridicShapeService.findAll();
  }

  @Get(':code')
  @UseGuards(EnterpriseOrCustomerGuard)
  findByCode(@Param('code') code: string) {
    return this.juridicShapeService.findByCode(code);
  }
}
