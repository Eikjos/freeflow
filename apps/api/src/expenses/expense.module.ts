import { Module } from '@nestjs/common';
import { MediaModule } from 'media/media.module';
import { PrismaService } from 'prisma.service';
import ExpenseController from './expense.controller';
import ExpenseService from './expense.service';

@Module({
  imports: [MediaModule],
  providers: [PrismaService, ExpenseService],
  controllers: [ExpenseController],
  exports: [ExpenseService],
})
export default class ExpenseModule {}
