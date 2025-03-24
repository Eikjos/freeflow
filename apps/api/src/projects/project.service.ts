import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import ProjectCreateDto from 'src/dtos/projects/project-create.dto';
import { mapProjectToDto } from 'src/dtos/projects/project.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  // -

  async findAllByEnterpriseId(enterpriseId: number) {
    const projects = await this.prisma.project.findMany({
      where: { enterpriseId },
      include: { customer: true },
    });
    return projects.map((p) => mapProjectToDto(p, p.customer));
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
