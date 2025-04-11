import { PrismaService } from 'src/prisma.service';

export default class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeForProject(projectId: number) {}
}
