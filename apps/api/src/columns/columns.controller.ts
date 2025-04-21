import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ColumnService from './columns.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('columns')
export default class ColumnsController {
  constructor(private readonly columnService: ColumnService) {}

  @UseInterceptors(FileInterceptor('files'))
  @UseGuards(AccessTokenGuard)
  @Post(':id/tasks')
  async createTasks(
    @Param('id', ParseIntPipe) id,
    @Body() model: CreateTaskDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return await this.columnService.createTask(id, model, files);
  }
}
