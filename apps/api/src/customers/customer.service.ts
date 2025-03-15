import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import {
  mapCustomerToDto,
  CustomerDto,
  mapCustomerToDetailDto,
} from 'src/dtos/customers/customer.dto';
import PaginationResultDto from 'src/dtos/utils/pagination-result.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // --

  async findAll(enterpriseId: number, page: number, pageSize: number) {
    const customers = await this.prisma.customer
      .findMany({
        where: {
          enterprises: {
            some: { enterpriseId: enterpriseId, isDeleted: false },
          },
        },
        include: { country: true },
        skip: pageSize * page,
        take: pageSize,
      })
      .then((res) => {
        return res.map((customer) =>
          mapCustomerToDto(customer, customer.country),
        );
      });
    const totalItems = await this.prisma.customer.count({
      where: {
        enterprises: {
          some: { enterpriseId: enterpriseId, isDeleted: false },
        },
      },
    });
    return {
      data: customers,
      totalItems: totalItems,
      page,
      pageSize,
    } as PaginationResultDto<CustomerDto>;
  }

  async findByIdAndEnterpriseId(id: number, enterpriseId: number) {
    const relation = await this.prisma.enterpriseCustomer.findFirst({
      where: { customerId: id, enterpriseId, isDeleted: false },
      include: {
        customer: true,
      },
    });
    if (!relation) throw new NotFoundException('customer.notFound');
    return mapCustomerToDetailDto(relation.customer, null);
  }

  async create(enterpriseId: number, model: CustomerCreateDto) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) {
      throw new ForbiddenException('access.denied');
    }
    const customer = await this.prisma.customer.create({
      data: {
        ...model,
        countryId: parseInt(model.countryId),
        enterprises: {
          create: { enterpriseId: enterpriseId, isDeleted: false },
        },
      },
    });
    const country = await this.prisma.country.findFirst({
      where: { id: customer.countryId },
    });
    return mapCustomerToDto(customer, country);
  }

  async delete(customerId: number, enterpriseId: number) {
    const customerRelation = await this.prisma.enterpriseCustomer.update({
      where: {
        enterpriseId_customerId: {
          enterpriseId: enterpriseId,
          customerId: customerId,
        },
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
    if (!customerRelation) throw new NotFoundException('customer.notFound');
  }
}
