import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import TaskService from './task.service';
import TasksController from './task.controller';

@Module({
  imports: [],
  providers: [PrismaService, TaskService],
  controllers: [TasksController],
  exports: [TaskService],
})
export default class TaskModule {}
