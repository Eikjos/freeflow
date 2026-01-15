import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { PaginationFilter } from '@repo/shared-types';
import ColumnService from 'columns/columns.service';
import CreateColumnDto from 'dtos/columns/column-create.dto';
import { mapToColumn } from 'dtos/columns/column.dto';
import ProjectCreateDto from 'dtos/projects/project-create.dto';
import { mapProjectWithTasksAndColumns } from 'dtos/projects/project-detail.dto';
import {
  ProjectDto,
  mapProjectToDetailDto,
  mapProjectToDto,
} from 'dtos/projects/project.dto';
import { PaginationResultDto } from 'dtos/utils/pagination-result.dto';
import { MediaService } from 'media/media.service';
import { PrismaService } from 'prisma.service';
@Injectable()
export default class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly columnService: ColumnService,
  ) {}

  // -

  async count(enterpriseId: number): Promise<number> {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    return await this.prisma.project.count({ where: { enterpriseId } });
  }

  async findAllByEnterpriseId(
    enterpriseId: number,
    filter: PaginationFilter<Project>,
  ): Promise<PaginationResultDto<ProjectDto>> {
    const projects = await this.prisma.project.findMany({
      where: { ...filter.filter, enterpriseId },
      include: { customer: true, enterprise: true },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });
    const totalItems = await this.prisma.project.count({
      where: {
        ...filter.filter,
        enterpriseId,
      },
    });
    return {
      data: projects.map((p) => mapProjectToDto(p, p.customer, p.enterprise)),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async findAllByCustomerId(
    customerId: number,
    filter: PaginationFilter<Project>,
  ): Promise<PaginationResultDto<ProjectDto>> {
    const projects = await this.prisma.project.findMany({
      where: { ...filter.filter, customerId },
      include: { customer: true, enterprise: true },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });
    const totalItems = await this.prisma.project.count({
      where: {
        ...filter.filter,
        customerId,
      },
    });
    return {
      data: projects.map((p) => mapProjectToDto(p, p.customer, p.enterprise)),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async findById(id: number, enterpriseId?: number, customerId?: number) {
    let project;
    if (enterpriseId) {
      project = await this.prisma.project.findFirst({
        where: { id, enterpriseId },
      });
    } else if (customerId) {
      project = await this.prisma.project.findFirst({
        where: { id, customerId },
      });
    }

    if (!project) throw new NotFoundException();
    return mapProjectToDetailDto(project);
  }

  async findByIdWithTasksAndColumns(
    id: number,
    enterpriseId?: number,
    customerId?: number,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ...(customerId != undefined && { customerId }),
        ...(enterpriseId != undefined && { enterpriseId }),
      },
      include: {
        columns: {
          include: { tasks: { include: { medias: true } } },
        },
      },
    });
    if (!project) throw new NotFoundException();

    return mapProjectWithTasksAndColumns(project, project.columns);
  }

  async create(
    model: ProjectCreateDto,
    enterpriseId: number,
    media?: Express.Multer.File,
  ) {
    if (enterpriseId == null) throw new ForbiddenException();
    const customer = await this.prisma.enterpriseCustomer.findFirst({
      where: { enterpriseId, customerId: model.customerId, isDeleted: false },
    });
    if (!customer) throw new BadRequestException('project.customer.notValid');
    const mediaId = media
      ? await this.mediaService.upload(media, `${enterpriseId}/images`)
      : undefined;

    const project = await this.prisma.project.create({
      data: {
        name: model.name,
        customerId: model.customerId,
        mediaId,
        enterpriseId,
      },
    });

    if (project.id > 0) {
      this.columnService.initializeForProject(project.id);
    }

    return project.id;
  }

  async createColumn(
    projectId: number,
    column: CreateColumnDto,
    enterpriseId?: number,
    customerId?: number,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ...(customerId !== undefined && { customerId }),
        ...(enterpriseId !== undefined && { enterpriseId }),
      },
      include: { columns: true },
    });
    if (!project) throw new NotFoundException();
    if (
      project.columns.filter(
        (c) =>
          c.name.toLocaleLowerCase().trim() ===
          column.name.toLocaleLowerCase().trim(),
      ).length
    ) {
      throw new BadRequestException('columns.already.exist');
    }
    const columnEntity = await this.prisma.column.create({
      data: {
        projectId: projectId,
        name: column.name,
        index: project.columns.length,
      },
    });
    return mapToColumn(columnEntity);
  }

  async reorderColumns(id: number, columnIds: number[]) {
    const project = await this.prisma.project.findFirst({
      where: { id },
      include: { columns: true },
    });
    if (!project) throw new NotFoundException();

    const notColumnsInProject = columnIds.filter(
      (c) => !project.columns.map((e) => e.id).includes(c),
    );

    if (notColumnsInProject.length > 0) throw new BadRequestException();

    await this.prisma.$transaction(
      columnIds.map((id, index) =>
        this.prisma.column.update({
          where: { id },
          data: { index },
        }),
      ),
    );
  }

  async update(
    projectId: number,
    model: ProjectCreateDto,
    enterpriseId?: number,
    customerId?: number,
    media?: Express.Multer.File,
  ) {
    if (enterpriseId == null && customerId == null)
      throw new ForbiddenException();
    let project;
    if (enterpriseId) {
      project = await this.prisma.project.findFirst({
        where: { id: projectId, enterpriseId },
      });
    } else if (customerId) {
      project = await this.prisma.project.findFirst({
        where: { id: projectId, customerId },
      });
    }
    if (!project) throw new NotFoundException('project.notFound');
    if (enterpriseId) {
      const customer = await this.prisma.enterpriseCustomer.findFirst({
        where: { enterpriseId, customerId: model.customerId, isDeleted: false },
      });
      if (!customer) throw new BadRequestException('project.customer.notValid');
    }
    const mediaId = media
      ? await this.mediaService.upload(media, `${enterpriseId}/images`)
      : undefined;

    project = await this.prisma.project.update({
      where: { id: projectId, enterpriseId: enterpriseId },
      data: {
        name: model.name,
        customerId: model.customerId,
        mediaId: media ? mediaId : project.mediaId,
        enterpriseId,
      },
    });

    return project.id;
  }

  async delete(id: number, enterpriseId: number) {
    if (enterpriseId == null) throw new ForbiddenException();
    const project = await this.prisma.project.findFirst({
      where: { id: id, enterpriseId },
    });
    if (!project) throw new NotFoundException('project.notFound');
    await this.prisma.project.delete({
      where: { id, enterpriseId },
    });
  }
}
