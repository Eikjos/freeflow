import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { MediaModule } from 'private/media/media.module';
import ExpenseController from './expense.controller';
import ExpenseService from './expense.service';

@Module({
  imports: [MediaModule],
  providers: [PrismaService, ExpenseService],
  controllers: [ExpenseController],
  exports: [ExpenseService],
})
export default class ExpenseModule {}
