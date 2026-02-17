import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma.service'
import ExpenseCategoryController from './expense-category.controller'
import ExpenseCategoryService from './expense-category.service'

@Module({
  imports: [],
  providers: [PrismaService, ExpenseCategoryService],
  controllers: [ExpenseCategoryController],
})
export default class ExpenseCategoryModule {}
