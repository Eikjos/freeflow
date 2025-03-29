import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { PrismaService } from 'src/prisma.service';
import ProjectController from './project.controller';
import ProjectService from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [MediaModule],
  providers: [PrismaService, ProjectService],
  exports: [ProjectService],
})
export default class ProjectModule {}
