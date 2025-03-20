import { Injectable } from '@nestjs/common';
import { mapProjectToDto } from 'src/dtos/projects/project.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // -

  async findAllByEnterpriseId(enterpriseId: number) {
    const projects = await this.prisma.project.findMany({
      where: { enterpriseId },
      include: { customer: true },
    });
    return projects.map((p) => mapProjectToDto(p, p.customer));
  }
}
