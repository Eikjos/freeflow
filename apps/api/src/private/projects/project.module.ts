import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import ColumnModule from 'private/columns/columns.module';
import { MediaModule } from 'private/media/media.module';
import ProjectController from './project.controller';
import ProjectService from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [MediaModule, ColumnModule],
  providers: [PrismaService, ProjectService],
  exports: [ProjectService],
})
export default class ProjectModule {}
