import { Module } from '@nestjs/common'
import { MediaModule } from 'media/media.module'
import { PrismaService } from 'prisma.service'
import ColumnsController from './columns.controller'
import ColumnService from './columns.service'

@Module({
  imports: [MediaModule],
  controllers: [ColumnsController],
  providers: [ColumnService, PrismaService],
  exports: [ColumnService],
})
export default class ColumnModule {}
