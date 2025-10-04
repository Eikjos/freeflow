import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import CreateExpenseDto from 'src/dtos/expenses/create-expense.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

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
    if (!category) throw new BadRequestException('expense.category.not.found');
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
}
