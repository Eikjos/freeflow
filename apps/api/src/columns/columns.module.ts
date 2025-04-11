import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import ColumnsController from './columns.controller';
import ColumnService from './columns.service';

@Module({
  controllers: [ColumnsController],
  providers: [PrismaService, ColumnService],
  exports: [ColumnService],
})
export default class ColumnModule {}
