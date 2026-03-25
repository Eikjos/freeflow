import { Controller, Get, UseGuards } from '@nestjs/common';
import ExpenseCategoryDto from 'dtos/expense-categories/expense-category.dto';
import { EnterpriseGuard } from 'guards/enterprise.guard';
import ExpenseCategoryService from './expense-category.service';

@Controller('expense-categories')
export default class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @UseGuards(EnterpriseGuard)
  @Get()
  findAll(): Promise<ExpenseCategoryDto[]> {
    return this.expenseCategoryService.findAll();
  }
}
