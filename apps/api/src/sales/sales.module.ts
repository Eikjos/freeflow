import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import SalesController from './sales.controller';
import SalesService from './sales.service';

@Module({
  imports: [],
  controllers: [SalesController],
  providers: [PrismaService, SalesService],
  exports: [SalesService],
})
export class SalesModule {}
