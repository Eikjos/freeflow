import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class SalesService {
  constructor(private readonly prismaService: PrismaService) {}

  // --
  async getCurrentSales(enterpriseId: number) {
    return await this.prismaService.sales.findFirst({
      where: { enterpriseId: enterpriseId },
    });
  }

  async create(enterpriseId: number, year: number) {
    return await this.prismaService.sales.create({
      data: {
        enterpriseId: enterpriseId,
        year: year,
        number: 0,
      },
    });
  }
}
