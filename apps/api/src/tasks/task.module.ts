import { Module } from '@nestjs/common'
import { MediaModule } from '../media/media.module'
import { PrismaService } from '../prisma.service'
import TasksController from './task.controller'
import TaskService from './task.service'

@Module({
  imports: [MediaModule],
  providers: [PrismaService, TaskService],
  controllers: [TasksController],
  exports: [TaskService],
})
export default class TaskModule {}
