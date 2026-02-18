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
import CreateObjectiveDto from 'dtos/objectives/create-objective.dto';
import { PaginationFilterDto } from 'dtos/utils/pagination-result.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import ObjectiveService from './objective.service';

@Controller('objectives')
export default class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @UseGuards(AccessTokenGuard)
  @Get('in-progress')
  getInProgress(@Req() req: Request) {
    const enterpriseId = parseInt(req.user['enterpriseId']);
    return this.objectiveService.findInProgress(enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(200)
  create(@Body() model: CreateObjectiveDto, @Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.create(model, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateObjectiveDto,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.update(id, model, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(
    @Query() fitler: PaginationFilterDto<undefined>,
    @Req() request: Request,
  ) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.findAll(fitler, enterpriseId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId']);
    return this.objectiveService.delete(id, enterpriseId);
  }
}
