import { Injectable, NotFoundException } from '@nestjs/common';
import { getRandomValues } from 'crypto';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { mapToTask } from 'src/dtos/tasks/task.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

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

  async createTask(
    columnId: number,
    model: CreateTaskDto,
    files?: Express.Multer.File[],
  ) {
    const column = await this.prisma.column.findFirst({
      where: { id: columnId },
      include: { tasks: true },
    });
    if (!column) throw new NotFoundException();

    const { mediaIds, files: filesModel, ...modelTask } = model;
    const task = await this.prisma.task.create({
      data: {
        ...modelTask,
        index: column.tasks.length,
        columnId: columnId,
      },
    });

    if (task.id > 0) {
      await this.prisma.taskMedia.createMany({
        data: mediaIds.map((m) => ({
          mediaId: m,
          taskId: task.id,
        })),
      });
    }

    const uploads = files?.length
      ? [
          ...model.mediaIds,
          ...(await Promise.all(files.map((f) => this.mediaService.upload(f)))),
        ]
      : [...model.mediaIds];

    return mapToTask(task, uploads);
  }
}
