import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import CreateColumnDto from 'dtos/columns/column-create.dto';
import MoveTaskDto from 'dtos/tasks/move-task.dto';
import CreateTaskDto from 'dtos/tasks/task-create.dto';
import { CustomerGuard } from 'guards/customer.guard';
import { EnterpriseGuard } from 'guards/enterprise.guard';
import ColumnService from './columns.service';

@Controller('columns')
export default class ColumnsController {
  constructor(private readonly columnService: ColumnService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Post(':id/tasks')
  @ApiBody({
    description: 'Créer une tâche',
    type: CreateTaskDto,
  })
  createTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.columnService.createTask(id, model, files);
  }

  @HttpCode(200)
  @Post(':id')
  @UseGuards(EnterpriseGuard, CustomerGuard)
  updateColumns(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateColumnDto,
  ) {
    return this.columnService.update(id, model);
  }

  @HttpCode(200)
  @Patch(':id/tasks/:taskId/move')
  @UseGuards(EnterpriseGuard, CustomerGuard)
  moveTasks(
    @Param('id', ParseIntPipe) id: number,
    @Param('taskId', ParseIntPipe) taskId,
    @Body() model: MoveTaskDto,
  ) {
    return this.columnService.moveTask(id, taskId, model.toPosition);
  }
}
