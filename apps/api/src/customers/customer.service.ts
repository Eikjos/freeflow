import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CustomerDetailModel } from '@repo/shared-types';
import { plainToClass, plainToInstance } from 'class-transformer';
import CustomerCreateDto from 'src/dtos/customers/customer-create.dto';
import {
  CustomerDetailDto,
  CustomerDto,
  mapCustomerToDetailDto,
  mapCustomerToDto,
} from 'src/dtos/customers/customer.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'src/dtos/utils/pagination-result.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // --

  async findAll(
    enterpriseId: number,
    filter: PaginationFilterDto<CustomerDetailDto>,
  ) {
    const transformedFilter = {};
    const { page, pageSize } = filter;

    if (filter.filter) {
      Object.entries(plainToInstance(CustomerDetailDto, filter.filter)).forEach(
        ([key, value]) => {
          if (typeof value === 'string' && value.trim() !== '') {
            transformedFilter[key] = {
              contains: value.trim(),
              mode: 'insensitive',
            };
          } else if (value) {
            transformedFilter[key] = value;
          }
        },
      );
    }
    const customers = await this.prisma.customer
      .findMany({
        where: {
          ...transformedFilter,
          enterprises: {
            some: { enterpriseId: enterpriseId, isDeleted: false },
          },
        },
        include: { country: true },
        skip: pageSize * page,
        take: pageSize,
        orderBy: filter.asc
          ? { [filter.asc]: 'asc' }
          : filter.desc
            ? { [filter.desc]: 'desc' }
            : { id: 'asc' },
      })
      .then((res) => {
        return res.map((customer) =>
          mapCustomerToDto(customer, customer.country),
        );
      });
    const totalItems = await this.prisma.customer.count({
      where: {
        ...transformedFilter,
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

  async update(
    customerId: number,
    enterpriseId: number,
    model: CustomerCreateDto,
  ) {
    const relation = await this.prisma.enterpriseCustomer.findFirst({
      where: { customerId, enterpriseId, isDeleted: false },
      include: {
        customer: true,
      },
    });
    if (!relation) throw new NotFoundException('customer.notFound');

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...model,
        countryId: parseInt(model.countryId),
      },
    });

    return mapCustomerToDto(customer, null);
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
    return mapCustomerToDto(customer, null);
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
