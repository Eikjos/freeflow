import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'guards/access-token.guard';
import JuridicShapeService from './juridic-shapes.service';

@Controller('juridic-shapes')
@ApiTags('Juridic Shape')
@ApiBearerAuth()
export default class JuridicShapesController {
  constructor(private readonly juridicShapeService: JuridicShapeService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.juridicShapeService.findAll();
  }

  @Get(':code')
  @UseGuards(AccessTokenGuard)
  findByCode(@Param('code') code: string) {
    return this.juridicShapeService.findByCode(code);
  }
}
