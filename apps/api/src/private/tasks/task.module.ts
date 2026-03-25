import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { MediaModule } from '../media/media.module';
import TasksController from './task.controller';
import TaskService from './task.service';

@Module({
  imports: [MediaModule],
  providers: [PrismaService, TaskService],
  controllers: [TasksController],
  exports: [TaskService],
})
export default class TaskModule {}
