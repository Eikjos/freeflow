import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import ObjectiveModule from 'src/objective/objective.module';
import { PrismaService } from 'src/prisma.service';
import InvoiceController from './invoice.controller';
import InvoiceService from './invoice.service';

@Module({
  imports: [MediaModule, ObjectiveModule],
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export default class InvoiceModule {}
