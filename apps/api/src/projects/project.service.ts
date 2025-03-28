import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { PaginationFilter } from '@repo/shared-types';
import ProjectCreateDto from 'src/dtos/projects/project-create.dto';
import {
  mapProjectToDetailDto,
  mapProjectToDto,
  ProjectDto,
} from 'src/dtos/projects/project.dto';
import { PaginationResultDto } from 'src/dtos/utils/pagination-result.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  // -

  async findAllByEnterpriseId(
    enterpriseId: number,
    filter: PaginationFilter<Project>,
  ): Promise<PaginationResultDto<ProjectDto>> {
    const projects = await this.prisma.project.findMany({
      where: { ...filter.filter, enterpriseId },
      include: { customer: true },
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
      data: projects.map((p) => mapProjectToDto(p, p.customer)),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async findById(id: number, enterpriseId: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, enterpriseId },
    });
    if (!project) throw new NotFoundException();
    return mapProjectToDetailDto(project);
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
    const mediaId = media ? await this.mediaService.upload(media) : undefined;

    const project = await this.prisma.project.create({
      data: {
        name: model.name,
        customerId: model.customerId,
        mediaId,
        enterpriseId,
      },
    });

    return project.id;
  }
}
