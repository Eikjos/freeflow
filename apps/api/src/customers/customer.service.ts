import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { randomBytes } from 'crypto'
import {
  CustomerDto,
  mapCustomerToDetailDto,
  mapCustomerToDto,
} from 'dtos/customers/customer.dto'
import CustomerCreateDto from 'dtos/customers/customer-create.dto'
import { CustomerFilterDto } from 'dtos/customers/customer-filter.dto'
import CustomerStatDto from 'dtos/customers/customer-stat.dto'
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'dtos/utils/pagination-result.dto'
import MailingService from 'mailing/mailing.service'
import ObjectiveService from 'objective/objective.service'
import { PrismaService } from 'prisma.service'

@Injectable()
export default class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly objectiveService: ObjectiveService,
    private readonly mailingService: MailingService,
  ) {}

  // --

  async invite(customerId: number, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) {
      throw new ForbiddenException()
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId },
      include: { enterprises: true },
    })
    if (!customer) {
      throw new NotFoundException()
    }

    const tokenDate = new Date()
    tokenDate.setDate(tokenDate.getDate() + 7)
    const token = randomBytes(32).toString('hex')
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        token: token,
        tokenDate,
      },
    })

    this.mailingService.sendCustomerInvite(
      customer.id,
      customer.email,
      token,
      enterprise.name,
    )
  }

  async findAll(
    enterpriseId: number,
    filter: PaginationFilterDto<CustomerFilterDto>,
  ) {
    const transformedFilter = {}
    const { page, pageSize } = filter

    if (filter.filter) {
      Object.entries(plainToInstance(CustomerFilterDto, filter.filter)).forEach(
        ([key, value]) => {
          if (typeof value === 'string' && value.trim() !== '') {
            transformedFilter[key] = {
              contains: value.trim(),
              mode: 'insensitive',
            }
          } else if (value) {
            transformedFilter[key] = value
          }
        },
      )
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
        )
      })
    const totalItems = await this.prisma.customer.count({
      where: {
        ...transformedFilter,
        enterprises: {
          some: { enterpriseId: enterpriseId, isDeleted: false },
        },
      },
    })
    return {
      data: customers,
      totalItems: totalItems,
      page,
      pageSize,
    } as PaginationResultDto<CustomerDto>
  }

  async findByIdAndEnterpriseId(id: number, enterpriseId: number) {
    const relation = await this.prisma.enterpriseCustomer.findFirst({
      where: { customerId: id, enterpriseId, isDeleted: false },
      include: {
        customer: true,
      },
    })
    if (!relation) throw new NotFoundException('customer.notFound')
    return mapCustomerToDetailDto(relation.customer, null)
  }

  async update(
    customerId: number,
    model: CustomerCreateDto,
    enterpriseId?: number,
  ) {
    if (enterpriseId) {
      const relation = await this.prisma.enterpriseCustomer.findFirst({
        where: { customerId, enterpriseId, isDeleted: false },
        include: {
          customer: true,
        },
      })
      if (!relation) throw new NotFoundException('customer.notFound')
    } else {
      const c = await this.prisma.customer.findFirst({
        where: { id: customerId },
      })
      if (!c) {
        throw new NotFoundException('customer.notFound')
      }
    }

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...model,
        countryId: parseInt(model.countryId),
      },
    })

    return mapCustomerToDto(customer, null)
  }

  async create(enterpriseId: number, model: CustomerCreateDto) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) {
      throw new ForbiddenException('access.denied')
    }
    const tokenDate = new Date()
    tokenDate.setDate(tokenDate.getDate() + 7)
    const token = randomBytes(32).toString('hex')
    const customer = await this.prisma.customer.create({
      data: {
        ...model,
        countryId: parseInt(model.countryId),
        enterprises: {
          create: { enterpriseId: enterpriseId, isDeleted: false },
        },
        token,
        tokenDate,
      },
    })

    if (customer) {
      this.objectiveService.increaseObjective(1, enterpriseId, 'CUSTOMER')
      this.mailingService.sendCustomerInvite(
        customer.id,
        customer.email,
        token,
        enterprise.name,
      )
    }

    return mapCustomerToDto(customer, null)
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
    })
    if (!customerRelation) throw new NotFoundException('customer.notFound')
  }

  async findById(id: number) {
    const customer = await this.prisma.customer.findFirst({
      where: { id },
      include: { country: true },
    })
    return mapCustomerToDto(customer, customer.country)
  }

  async getStats(enterpriseId: number, months: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) {
      throw new ForbiddenException()
    }
    const dateFrom = new Date()
    dateFrom.setMonth(dateFrom.getMonth() - months + 1)

    const result = await this.prisma.$queryRaw<CustomerStatDto[]>`
    WITH months AS (
      SELECT 
        generate_series(
          DATE_TRUNC('month', ${dateFrom}::timestamp),
          DATE_TRUNC('month', NOW()),
          interval '1 month'
        ) AS month
    )
    SELECT 
      TO_CHAR(m.month, 'YYYY-MM') AS month,
      COUNT(c.id) AS customers
    FROM months m
    LEFT JOIN "Customer" c
      ON c."createdAt" <= (m.month + interval '1 month' - interval '1 day')
      AND c.id IN (
        SELECT ec."customerId"
        FROM "EnterpriseCustomer" ec
        WHERE ec."enterpriseId" = ${enterpriseId} AND ec."isDeleted" = false
      )
    GROUP BY m.month
    ORDER BY m.month;
  `

    return result.map((r) => ({
      month: r.month,
      customers: Number(r.customers),
    }))
  }

  async getStatsByYear(year: number, enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) {
      throw new ForbiddenException()
    }

    const dateFrom = new Date(`${year}-01-01`)
    const now = new Date()
    const dateTo = year === now.getFullYear() ? now : new Date(`${year}-12-31`)

    const result = await this.prisma.$queryRaw<CustomerStatDto[]>`
    WITH months AS (
      SELECT 
        generate_series(
          DATE_TRUNC('month', ${dateFrom}::timestamp),
          DATE_TRUNC('month',  ${dateTo}::timestamp),
          interval '1 month'
        ) AS month
    )
    SELECT 
      TO_CHAR(m.month, 'YYYY-MM') AS month,
      COUNT(c.id) AS customers
    FROM months m
    LEFT JOIN "Customer" c
      ON c."createdAt" <= (m.month + interval '1 month' - interval '1 day')
      AND c.id IN (
        SELECT ec."customerId"
        FROM "EnterpriseCustomer" ec
        WHERE ec."enterpriseId" = ${enterpriseId} AND ec."isDeleted" = false
      )
    GROUP BY m.month
    ORDER BY m.month;
  `

    return result.map((r) => ({
      month: r.month,
      customers: Number(r.customers),
    }))
  }

  async count(enterpriseId: number): Promise<number> {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) throw new ForbiddenException()
    return await this.prisma.enterpriseCustomer.count({
      where: { enterpriseId },
    })
  }
}
