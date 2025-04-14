import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ColumnService from './columns.service';

@Controller('columns')
export default class ColumnsController {
  constructor(private readonly columnService: ColumnService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':id/tasks')
  async createTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
  ) {
    return await this.columnService.createTask(id, model);
  }
}
