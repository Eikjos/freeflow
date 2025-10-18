import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import ObjectiveController from './objective.controller';
import ObjectiveService from './objective.service';

@Module({
  controllers: [ObjectiveController],
  providers: [PrismaService, ObjectiveService],
  exports: [ObjectiveService],
})
export default class ObjectiveModule {}
