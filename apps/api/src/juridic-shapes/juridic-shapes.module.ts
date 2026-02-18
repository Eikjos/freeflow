import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import JuridicShapesController from './juridic-shapes.controller';
import JuridicShapeService from './juridic-shapes.service';

@Module({
  providers: [PrismaService, JuridicShapeService],
  controllers: [JuridicShapesController],
  exports: [JuridicShapeService],
})
export default class JuridicShapeModule {}
