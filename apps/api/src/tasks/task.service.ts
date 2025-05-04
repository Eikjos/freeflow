import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreateTaskDto from 'src/dtos/tasks/task-create.dto';
import { mapToTask } from 'src/dtos/tasks/task.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async delete(taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      include: { medias: true },
    });
    if (!task) throw new HttpException('', HttpStatus.NO_CONTENT);

    task.medias.forEach((m) => {
      this.deleteMedia(taskId, m.mediaId);
    });

    await this.prisma.task.delete({ where: { id: taskId } });
  }

  async deleteMedia(taskId: number, mediaId: number) {
    try {
      const deleted = await this.prisma.taskMedia.delete({
        where: { taskId_mediaId: { taskId, mediaId } },
      });
      if (!deleted) throw new HttpException('', HttpStatus.NO_CONTENT);
    } catch {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }

    // suppression de l'image
    return await this.mediaService.delete(mediaId);
  }

  async update(
    taskId: number,
    model: CreateTaskDto,
    files: Express.Multer.File[],
  ) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });
    if (!task) throw new NotFoundException();

    const { mediaIds, files: _, ...modelTask } = model;
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...modelTask,
        index: task.index,
        columnId: task.columnId,
      },
    });

    if (updatedTask.id > 0) {
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
                files.map((f) => this.mediaService.upload(f)),
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

      return mapToTask(updatedTask, uploads);
    }
    throw new ConflictException();
  }
}
