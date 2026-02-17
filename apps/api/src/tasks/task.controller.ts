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
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import CreateTaskDto from 'dtos/tasks/task-create.dto'
import { TaskPaginationFilterDto } from 'dtos/tasks/task-filter.dto'
import { Request } from 'express'
import { AccessTokenGuard } from 'guards/access-token.guard'
import { CustomerGuard } from 'guards/customer.guard'
import { EnterpriseGuard } from 'guards/enterprise.guard'
import TaskService from './task.service'

@Controller('/tasks')
export default class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Get()
  getAll(@Query() filter: TaskPaginationFilterDto) {
    return this.taskService.getAll(filter)
  }

  @UseGuards(EnterpriseGuard)
  @Get('urgents')
  getUrgentsTasks(@Req() request: Request) {
    const enterpriseId = parseInt(request.user['enterpriseId'])
    return this.taskService.getUrgentsTask(enterpriseId)
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findById(id)
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Delete(':id/medias/:mediaId')
  deleteMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ) {
    return this.taskService.deleteMedia(id, mediaId)
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
  updateTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const enterpriseId = req.user['enterpriseId']
    return this.taskService.update(
      id,
      model,
      files,
      parseInt(enterpriseId) || undefined,
    )
  }

  @UseGuards(EnterpriseGuard, CustomerGuard)
  @Delete(':id')
  @HttpCode(200)
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id)
  }
}
