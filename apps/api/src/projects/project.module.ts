import { Module } from '@nestjs/common'
import ColumnModule from 'columns/columns.module'
import { MediaModule } from 'media/media.module'
import { PrismaService } from 'prisma.service'
import ProjectController from './project.controller'
import ProjectService from './project.service'

@Module({
  controllers: [ProjectController],
  imports: [MediaModule, ColumnModule],
  providers: [PrismaService, ProjectService],
  exports: [ProjectService],
})
export default class ProjectModule {}
