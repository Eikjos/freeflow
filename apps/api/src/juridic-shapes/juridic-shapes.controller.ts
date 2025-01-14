import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import JuridicShapeService from './juridic-shapes.service';

@Controller('juridic-shapes')
@ApiTags('Juridic Shape')
@ApiBearerAuth()
export default class JuridicShapesController {
  constructor(private readonly juridicShapeService: JuridicShapeService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async findAll() {
    return await this.juridicShapeService.findAll();
  }
}
