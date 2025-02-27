import { ForbiddenException, Injectable } from '@nestjs/common';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // --

  async findAll(enterpriseId: number, page: number, pageSize: number) {
    return await this.prisma.customer.findMany({
      where: { enterprises: { some: { id: enterpriseId } } },
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async create(enterpriseId: number, model: CustomerCreateDto) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) {
      throw new ForbiddenException();
    }
    const customer = await this.prisma.customer.create({
      data: {
        ...model,
        countryId: parseInt(model.countryId),
        enterprises: { connect: { id: enterpriseId } },
      },
    });
    return customer;
  }
}
