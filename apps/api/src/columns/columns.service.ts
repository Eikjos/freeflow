import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreateColumnDto from 'dtos/columns/column-create.dto';
import CreateTaskDto from 'dtos/tasks/task-create.dto';
import { mapToTask } from 'dtos/tasks/task.dto';
import { MediaService } from 'media/media.service';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class ColumnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async initializeForProject(projectId: number) {
    const columnNames = ['À faire', 'En cours', 'À tester', 'À valider'];
    columnNames.map(async (c, index) => {
      const column = await this.prisma.column.create({
        data: { name: c, index, projectId },
      });
      return column.id;
    });
  }

  async update(id: number, model: CreateColumnDto) {
    const column = await this.prisma.column.findFirst({ where: { id } });
    if (!column) throw new NotFoundException();

    const updated = await this.prisma.column.update({
      data: {
        ...model,
      },
      where: { id },
    });

    return updated;
  }

  async createTask(
    columnId: number,
    model: CreateTaskDto,
    files?: Express.Multer.File[],
  ) {
    const column = await this.prisma.column.findFirst({
      where: { id: columnId },
      include: { tasks: true, project: true },
    });
    if (!column) throw new NotFoundException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mediaIds, files: _, ...modelTask } = model;
    const task = await this.prisma.task.create({
      data: {
        ...modelTask,
        index: column.tasks.length,
        columnId: columnId,
      },
    });

    if (task.id > 0) {
      if (model.mediaIds && model.mediaIds.length > 0) {
        await this.prisma.taskMedia.createMany({
          data: model.mediaIds.map((m) => ({
            mediaId: m,
            taskId: task.id,
            type: 'DESCRIPTION',
          })),
        });
      }

      const uploads =
        files?.length > 0
          ? [
              ...(await Promise.all(
                files.map((f) =>
                  this.mediaService.upload(
                    f,
                    `${column.project.enterpriseId}/tasks/files`,
                  ),
                ),
              )),
            ]
          : [];

      await this.prisma.taskMedia.createMany({
        data: uploads.map((m) => ({
          mediaId: m,
          taskId: task.id,
          type: 'ATTACHED',
        })),
      });

      return mapToTask(task, uploads);
    }
    throw new ConflictException();
  }

  async moveTask(columnId: number, taskId: number, toPosition: number) {
    const column = await this.prisma.column.findFirst({
      where: { id: columnId },
    });
    if (!column) throw new NotFoundException();

    const task = await this.prisma.task.findFirst({ where: { id: taskId } });
    if (!task) throw new NotFoundException();

    const isSameColumn = task.columnId === columnId;

    // 1. Décale les tâches de la colonne cible
    await this.prisma.$transaction(async (tx) => {
      // Si on change de colonne, on réordonne la source
      if (!isSameColumn) {
        await tx.task.updateMany({
          where: {
            columnId: task.columnId,
            index: {
              gt: task.index,
            },
          },
          data: {
            index: {
              decrement: 1,
            },
          },
        });
      }

      // Décale les tâches de la cible pour faire de la place
      await tx.task.updateMany({
        where: {
          columnId: columnId,
          index: {
            gte: toPosition,
          },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      // Déplace la tâche
      await tx.task.update({
        where: { id: taskId },
        data: {
          columnId: columnId,
          index: toPosition,
        },
      });
    });
  }
}
