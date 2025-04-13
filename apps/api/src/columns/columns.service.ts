import { Injectable } from '@nestjs/common';
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
}
