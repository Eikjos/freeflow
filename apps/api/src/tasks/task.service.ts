import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { mapToTask, TaskDto } from 'dtos/tasks/task.dto'
import CreateTaskDto from 'dtos/tasks/task-create.dto'
import { TaskPaginationFilterDto } from 'dtos/tasks/task-filter.dto'
import { PaginationResultDto } from 'dtos/utils/pagination-result.dto'
import { MediaService } from 'media/media.service'
import { PrismaService } from 'prisma.service'

@Injectable()
export default class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async getAll(
    filter: TaskPaginationFilterDto,
  ): Promise<PaginationResultDto<TaskDto>> {
    const where: Prisma.TaskWhereInput = {}

    if (filter.filter) {
      if (filter.filter.name) {
        where.name = { contains: filter.filter.name, mode: 'insensitive' }
      }

      if (filter.filter.customerId) {
        where.column = {
          project: {
            customerId: filter.filter.customerId,
          },
        }
      }
    }

    const orderBy = filter.asc
      ? { [filter.asc]: 'asc' }
      : filter.desc
        ? { [filter.desc]: 'desc' }
        : undefined

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy,
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    })

    const totalItems = await this.prisma.task.count({
      where,
    })

    return {
      data: tasks.map((t) => mapToTask(t, null)),
      totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    }
  }

  async getUrgentsTask(enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) throw new ForbiddenException()
    const tasks = await this.prisma.task.findMany({
      where: {
        priority: 'HIGH',
        column: {
          index: { gte: 0, lte: 2 },
          project: { enterpriseId: enterpriseId },
        },
      },
      include: { column: { include: { project: true } }, medias: true },
    })
    return tasks.map((t) =>
      mapToTask(
        t,
        t.medias.map((t) => t.mediaId),
      ),
    )
  }

  async findById(taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    })
    if (!task) throw new HttpException('', HttpStatus.NOT_FOUND)

    return task
  }

  async delete(taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      include: { medias: true },
    })
    if (!task) throw new HttpException('', HttpStatus.NO_CONTENT)

    task.medias.forEach((m) => {
      this.deleteMedia(taskId, m.mediaId)
    })

    await this.prisma.task.delete({ where: { id: taskId } })
  }

  async deleteMedia(taskId: number, mediaId: number) {
    try {
      const deleted = await this.prisma.taskMedia.delete({
        where: { taskId_mediaId: { taskId, mediaId } },
      })
      if (!deleted) throw new HttpException('', HttpStatus.NO_CONTENT)
    } catch {
      throw new HttpException('', HttpStatus.NO_CONTENT)
    }

    // suppression de l'image
    return await this.mediaService.delete(mediaId)
  }

  async update(
    taskId: number,
    model: CreateTaskDto,
    files: Express.Multer.File[],
    enterpriseId?: number,
  ) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    })
    if (!task) throw new NotFoundException()

    const { mediaIds, files: _, ...modelTask } = model
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...modelTask,
        index: task.index,
        columnId: task.columnId,
      },
    })

    if (updatedTask.id > 0) {
      if (model.mediaIds && model.mediaIds.length > 0) {
        await this.prisma.taskMedia.createMany({
          data: model.mediaIds.map((m) => ({
            mediaId: m,
            taskId: task.id,
            type: 'DESCRIPTION',
          })),
        })
      }

      const uploads =
        files?.length > 0
          ? [
              ...(await Promise.all(
                files.map((f) =>
                  this.mediaService.upload(f, `${enterpriseId}/tasks/files`),
                ),
              )),
            ]
          : []

      await this.prisma.taskMedia.createMany({
        data: uploads.map((m) => ({
          mediaId: m,
          taskId: task.id,
          type: 'ATTACHED',
        })),
      })

      return mapToTask(updatedTask, uploads)
    }
    throw new ConflictException()
  }
}
