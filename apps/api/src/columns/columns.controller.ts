import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import CreateColumnDto from 'dtos/columns/column-create.dto';
import MoveTaskDto from 'dtos/tasks/move-task.dto';
import CreateTaskDto from 'dtos/tasks/task-create.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import ColumnService from './columns.service';

@Controller('columns')
export default class ColumnsController {
  constructor(private readonly columnService: ColumnService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseGuards(AccessTokenGuard)
  @Post(':id/tasks')
  @ApiBody({
    description: 'Créer une tâche',
    type: CreateTaskDto,
  })
  async createTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.columnService.createTask(
      id,
      model,
      parseInt(enterpriseId),
      files,
    );
  }

  @HttpCode(200)
  @Post(':id')
  @UseGuards(AccessTokenGuard)
  async updateColumns(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: CreateColumnDto,
  ) {
    return await this.columnService.update(id, model);
  }

  @HttpCode(200)
  @Patch(':id/tasks/:taskId/move')
  @UseGuards(AccessTokenGuard)
  async moveTasks(
    @Param('id', ParseIntPipe) id: number,
    @Param('taskId', ParseIntPipe) taskId,
    @Body() model: MoveTaskDto,
  ) {
    return await this.columnService.moveTask(id, taskId, model.toPosition);
  }
}
