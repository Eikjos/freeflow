import { Injectable, NotFoundException } from '@nestjs/common';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { mapToTask } from 'src/dtos/tasks/task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeForProject(projectId: number) {
    const columnNames = ['À faire', 'En cours', 'À tester', 'À valider'];
    columnNames.map(async (c, index) => {
      const column = await this.prisma.column.create({
        data: { name: c, index, projectId },
      });
      return column.id;
    });
  }

  async createTask(columnId: number, model: CreateTaskDto) {
    const column = await this.prisma.column.findFirst({
      where: { id: columnId },
      include: { tasks: true },
    });
    if (!column) throw new NotFoundException();

    const task = await this.prisma.task.create({
      data: {
        ...model,
        index: column.tasks.length,
        columnId: columnId,
      },
    });

    return mapToTask(task);
  }
}
