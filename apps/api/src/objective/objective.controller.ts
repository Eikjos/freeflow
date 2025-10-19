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
import { Request } from 'express';
import CreateObjectiveDto from 'src/dtos/objectives/create-objective.dto';
import { PaginationFilterDto } from 'src/dtos/utils/pagination-result.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ObjectiveService from './objective.service';

@Controller('objectives')
export default class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(200)
  async create(@Body() model: CreateObjectiveDto, @Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.create(model, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateObjectiveDto,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.update(id, model, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query() fitler: PaginationFilterDto<undefined>,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.findAll(fitler, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.delete(id, enterpriseId);
  }
}
