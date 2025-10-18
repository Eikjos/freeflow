import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import CreateObjectiveDto from 'src/dtos/objectives/create-objective-dto';
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
}
