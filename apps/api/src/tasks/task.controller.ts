import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { TaskPaginationFilterDto } from 'src/dtos/tasks/task-filter.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import TaskService from './task.service';

@Controller('/tasks')
export default class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAll(@Query() filter: TaskPaginationFilterDto) {
    return this.taskService.getAll(filter);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/medias/:mediaId')
  async deleteMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ) {
    return this.taskService.deleteMedia(id, mediaId);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @ApiBody({
    description: 'Mise à jour de la tâche',
    type: CreateTaskDto,
  })
  async updateTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId'];
    return await this.taskService.update(
      id,
      model,
      parseInt(enterpriseId),
      files,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.delete(id);
  }
}
