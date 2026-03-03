import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import OpinionController from './opinion.controller';
import OpinionService from './opinion.service';

@Module({
  imports: [],
  controllers: [OpinionController],
  providers: [PrismaService, OpinionService],
  exports: [OpinionService],
})
export default class OpinionModule {}
