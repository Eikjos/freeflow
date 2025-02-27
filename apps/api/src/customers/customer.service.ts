import { ForbiddenException, Injectable } from '@nestjs/common';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import CustomerDto, { mapCustomerToDto } from 'src/dtos/customers/customer.dto';
import PaginationResultDto from 'src/dtos/utils/pagination-result.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // --

  async findAll(enterpriseId: number, page: number, pageSize: number) {
    const customers = await this.prisma.customer
      .findMany({
        where: { enterprises: { some: { id: enterpriseId } } },
        include: { country: true },
        skip: pageSize * page,
        take: pageSize,
      })
      .then((res) => {
        return res.map((customer) =>
          mapCustomerToDto(customer, customer.country),
        );
      });
    const totalItems = await this.prisma.customer.count();
    return {
      data: customers,
      totalItems: totalItems,
      page,
      pageSize,
    } as PaginationResultDto<CustomerDto>;
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
    const country = await this.prisma.country.findFirst({
      where: { id: customer.countryId },
    });
    return mapCustomerToDto(customer, country);
  }
}
