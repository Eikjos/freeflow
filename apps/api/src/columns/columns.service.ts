import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeForProject(projectId: number) {
    const columnNames = [
      'columns.todo',
      'columns.ongoing',
      'columms.testing',
      'columms.validate',
    ];
    columnNames.map(async (c, index) => {
      const column = await this.prisma.column.create({
        data: { name: c, index, projectId },
      });
      return column.id;
    });
  }
}
