import { Controller, Get, UseGuards } from '@nestjs/common';
import ExpenseCategoryDto from 'src/dtos/expense-categories/expense-category.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import ExpenseCategoryService from './expense-category.service';

@Controller('expense-categories')
export default class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(): Promise<ExpenseCategoryDto[]> {
    return await this.expenseCategoryService.findAll();
  }
}
