import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // --

  async findAll(enterpriseId: number, page: number, pageSize: number) {
    return await this.prisma.customer.findMany({
      where: { enterprises: { some: { id: enterpriseId } } },
      skip: page * pageSize,
      take: page,
    });
  }
}
