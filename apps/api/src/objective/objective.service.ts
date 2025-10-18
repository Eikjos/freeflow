import { ForbiddenException, Injectable } from '@nestjs/common';
import CreateObjectiveDto from 'src/dtos/objectives/create-objective-dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ObjectiveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: CreateObjectiveDto, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    await this.prisma.objective.create({
      data: {
        startDate: model.startDate ?? new Date(),
        endDate: model.endDate,
        category: model.objectiveCategory,
        objectiveNumber: model.objectiveNumber,
        currentNumber: 0,
        enterpriseId,
      },
    });
  }
}
