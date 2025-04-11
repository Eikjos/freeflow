import { Module } from '@nestjs/common';
import ColumnModule from 'src/columns/columns.module';
import { MediaModule } from 'src/media/media.module';
import { PrismaService } from 'src/prisma.service';
import ProjectController from './project.controller';
import ProjectService from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [MediaModule, ColumnModule],
  providers: [PrismaService, ProjectService],
  exports: [ProjectService],
})
export default class ProjectModule {}
