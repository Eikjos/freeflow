import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import SalesService from './sales.service';

@Module({
  imports: [],
  providers: [PrismaService, SalesService],
  exports: [SalesService],
})
export class SalesModule {}
