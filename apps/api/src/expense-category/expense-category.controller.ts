import { Controller, Get, UseGuards } from '@nestjs/common'
import ExpenseCategoryDto from 'dtos/expense-categories/expense-category.dto'
import { AccessTokenGuard } from 'guards/access-token.guard'
import ExpenseCategoryService from './expense-category.service'

@Controller('expense-categories')
export default class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(): Promise<ExpenseCategoryDto[]> {
    return this.expenseCategoryService.findAll()
  }
}
