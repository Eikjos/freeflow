import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { MediaModule } from 'private/media/media.module';
import ColumnsController from './columns.controller';
import ColumnService from './columns.service';

@Module({
  imports: [MediaModule],
  controllers: [ColumnsController],
  providers: [ColumnService, PrismaService],
  exports: [ColumnService],
})
export default class ColumnModule {}
