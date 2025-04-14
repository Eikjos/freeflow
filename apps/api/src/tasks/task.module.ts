import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import TaskService from './task.service';

@Module({
  imports: [],
  providers: [PrismaService, TaskService],
  exports: [TaskService],
})
export default class TaskModule {}
