import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateInvoiceDto } from 'src/dtos/invoices/invoice-create.dto';
import { InvoiceFilterDataDto } from 'src/dtos/invoices/invoice-filter.dto';
import {
  InvoiceDto,
  mapToDto as mapInvoiceToDto,
} from 'src/dtos/invoices/invoice.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'src/dtos/utils/pagination-result.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async createInvoice(
    invoice: CreateInvoiceDto,
    invoiceFile: Express.Multer.File,
    enterpriseId: number,
  ) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: invoice.customerId,
      },
    });
    if (!customer) throw new BadRequestException('customer.not.found');

    // upload invoice
    const mediaId = await this.mediaService.upload(
      invoiceFile,
      `${enterprise.id}/${invoice.type === 'INVOICE' ? 'invoices' : 'devis'}/${invoice.date.getFullYear()}`,
    );
    // create invoice in database
    const invoiceEntity = await this.prisma.invoice.create({
      data: {
        date: invoice.date,
        mediaId,
        name: invoice.title,
        customerId: invoice.customerId,
        enterpriseId: enterpriseId,
        number: invoice.number,
        type: invoice.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        status:
          invoice.type === 'INVOICE' ? 'WAITING_PAYED' : 'WAITING_VALIDATION',
        excludeTva: invoice.excludeTva,
        invoiceLines: {
          create: invoice.invoiceLines.map((e) => ({
            name: e.name,
            quantity: e.quantity,
            prixUnit: e.unitPrice,
          })),
        },
      },
    });

    // If creation OK - increase the number of lastest invoice
    if (invoiceEntity) {
      await this.prisma.enterprise.update({
        where: { id: enterpriseId },
        data: {
          lastInvoiceNumber: enterprise.lastInvoiceNumber + 1,
        },
      });
    }

    // TODO : envoyer le mail au client
  }

  async findAll(
    filter: PaginationFilterDto<InvoiceFilterDataDto>,
    enterpriseId: number,
  ): Promise<PaginationResultDto<InvoiceDto>> {
    let filterQuery: Prisma.InvoiceWhereInput = { enterpriseId };

    if (filter.filter) {
      if (filter.filter.number && filter.filter.number !== '') {
        filterQuery = {
          ...filterQuery,
          number: { contains: filter.filter.number, mode: 'insensitive' },
        };
      }
      if (filter.filter.type) {
        filterQuery = { ...filterQuery, type: filter.filter.type };
      }
      if (filter.filter.status) {
        filterQuery = { ...filterQuery, status: filter.filter.status };
      }
      if (filter.filter.startDate) {
        filterQuery = {
          ...filterQuery,
          date: { gte: filter.filter.startDate },
        };
      }
      if (filter.filter.endDate) {
        filterQuery = { ...filterQuery, date: { lte: filter.filter.endDate } };
      }
      if (filter.filter.customerId) {
        filterQuery = {
          ...filterQuery,
          customerId: parseInt(`${filter.filter.customerId}`),
        };
      }
    }

    const invoices = await this.prisma.invoice.findMany({
      where: filterQuery,
      include: { invoiceLines: true, customer: true },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });

    const totalItems = await this.prisma.invoice.count({
      where: filterQuery,
    });

    return {
      data: invoices.map((i) => mapInvoiceToDto(i, i.invoiceLines, i.customer)),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }
}
