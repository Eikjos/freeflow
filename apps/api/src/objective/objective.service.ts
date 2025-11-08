import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectiveCategory } from '@prisma/client';
import CreateObjectiveDto from 'src/dtos/objectives/create-objective.dto';
import ObjectiveDto from 'src/dtos/objectives/objective.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'src/dtos/utils/pagination-result.dto';
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

  async findInProgress(enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    const objectives = await this.prisma.objective.findMany({
      where: {
        enterpriseId,
        startDate: { lte: new Date() },
        endDate: { gt: new Date() },
      },
    });
    return objectives.map((o) => new ObjectiveDto(o));
  }

  async update(id: number, model: CreateObjectiveDto, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    const objective = await this.prisma.objective.findFirst({
      where: { id, enterpriseId },
    });
    if (!objective) throw new NotFoundException();

    await this.prisma.objective.update({
      where: { id },
      data: {
        startDate: model.startDate ?? new Date(),
        endDate: model.endDate,
        category: model.objectiveCategory,
        objectiveNumber: model.objectiveNumber,
        enterpriseId,
      },
    });
  }

  async findAll(filter: PaginationFilterDto<undefined>, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    const objectives = await this.prisma.objective.findMany({
      where: { enterpriseId },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });
    const objectivesCount = await this.prisma.objective.count({
      where: { enterpriseId },
    });

    return {
      data: objectives.map((o) => new ObjectiveDto(o)),
      totalItems: objectivesCount,
      page: filter.page,
      pageSize: filter.pageSize,
    } as PaginationResultDto<ObjectiveDto>;
  }

  async delete(id: number, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();

    const objective = await this.prisma.objective.findFirst({
      where: { id, enterpriseId },
    });
    if (!objective) throw new NotFoundException();

    await this.prisma.objective.delete({ where: { id, enterpriseId } });
  }

  async increaseObjective(
    value: number,
    enterpriseId: number,
    category: ObjectiveCategory,
  ) {
    const objectives = await this.prisma.objective.findMany({
      where: {
        enterpriseId,
        startDate: { lt: new Date() },
        endDate: { gt: new Date() },
        category: category,
      },
    });
    await Promise.all(
      objectives.map(async (o) => {
        await this.prisma.objective.update({
          where: { id: o.id },
          data: {
            currentNumber:
              o.currentNumber + value < 0 ? 0 : o.currentNumber + value,
          },
        });
      }),
    );
  }
}
