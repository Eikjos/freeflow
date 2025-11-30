import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import CreateExpenseDto from 'dtos/expenses/create-expense.dto';
import ExpenseFilterDto from 'dtos/expenses/expense-filter.dto';
import { toExpenseDto } from 'dtos/expenses/expense.dto';
import { PaginationFilterDto } from 'dtos/utils/pagination-result.dto';
import { MediaService } from 'media/media.service';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class ExpenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    model: CreateExpenseDto,
    file: Express.Multer.File,
    enterpriseId: number,
  ) {
    // check if the entreprise Id exist
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    // check if the category exist
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id: model.categoryId },
    });
    if (!category) throw new BadRequestException('expense.category.notFound');
    // save expense
    const expense = await this.prisma.expense.create({
      data: {
        name: model.name,
        description: model.description,
        categoryId: model.categoryId,
        date: model.date,
        price: model.amount,
        enterpriseId: enterpriseId,
      },
    });
    // save file if success
    if (expense) {
      const mediaId = await this.mediaService.upload(
        file,
        `${enterpriseId}/expenses/${new Date().getFullYear()}`,
      );
      if (mediaId > 0) {
        await this.prisma.expense.update({
          where: { id: expense.id },
          data: { mediaId },
        });
      }
    }
  }

  async findAll(
    enterpriseId: number,
    filter: PaginationFilterDto<ExpenseFilterDto>,
  ) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    let filterQuery: Prisma.ExpenseWhereInput = { enterpriseId };
    if (filter.filter) {
      if (filter.filter.search && filter.filter.search !== '') {
        filterQuery = {
          ...filterQuery,
          name: { contains: filter.filter.search, mode: 'insensitive' },
        };
      }
      if (filter.filter.startDate) {
        filterQuery = {
          ...filterQuery,
          date: { gte: filter.filter.startDate },
        };
      }
      if (filter.filter.endDate) {
        filterQuery = { ...filterQuery, date: { lte: filter.filter.endDate } };
      }
      if (filter.filter.category) {
        filterQuery = {
          ...filterQuery,
          categoryId: parseInt(`${filter.filter.category}`),
        };
      }
      if (
        filter.filter.amountMin &&
        parseInt(`${filter.filter.amountMin}`) > 0
      ) {
        filterQuery = {
          ...filterQuery,
          price: { gte: parseInt(`${filter.filter.amountMin}`) },
        };
      }

      if (
        filter.filter.amountMax &&
        parseInt(`${filter.filter.amountMax}`) > 0
      ) {
        filterQuery = {
          ...filterQuery,
          price: { lte: parseInt(`${filter.filter.amountMax}`) },
        };
      }
    }

    const expenses = await this.prisma.expense.findMany({
      where: filterQuery,
      include: { category: true },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });

    const totalItems = await this.prisma.expense.count({
      where: filterQuery,
    });

    return {
      data: expenses.map((e) => toExpenseDto(e, e.category)),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async delete(id: number, enterpriseId: number) {
    // check enterprise and expense
    const expense = await this.prisma.expense.findFirst({
      where: { enterpriseId, id },
    });
    if (!expense) throw new NotFoundException('expense.notFound');
    // remove media
    this.mediaService.delete(expense.mediaId);
    // remove expense
    await this.prisma.expense.delete({ where: { id } });
  }

  async getTotalExpenseByYear(
    enterpriseId: number,
    year?: number,
  ): Promise<number> {
    let filterQuery: Prisma.ExpenseWhereInput = { enterpriseId };
    if (year !== undefined) {
      filterQuery = {
        ...filterQuery,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      };
    }
    const expenses = await this.prisma.expense.aggregate({
      where: filterQuery,
      _sum: {
        price: true,
      },
    });
    return expenses._sum.price ? expenses._sum.price.toNumber() : 0.0;
  }
}
