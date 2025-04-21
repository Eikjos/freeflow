import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import ColumnsController from './columns.controller';
import ColumnService from './columns.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [ColumnsController],
  providers: [ColumnService, PrismaService],
  exports: [ColumnService],
})
export default class ColumnModule {}
