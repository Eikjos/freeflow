import { Injectable } from '@nestjs/common';
import ExpenseCategoryDto from 'dtos/expense-categories/expense-category.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class ExpenseCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ExpenseCategoryDto[]> {
    return (await this.prisma.expenseCategory.findMany()).map(
      (e) =>
        ({
          ...e,
        }) as ExpenseCategoryDto,
    );
  }
}
