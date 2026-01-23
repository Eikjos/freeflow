import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { mapCustomerToDetailDto } from 'dtos/customers/customer.dto';
import {
  CreateInvoiceDto,
  CreateInvoiceLineDto,
} from 'dtos/invoices/invoice-create.dto';
import { InvoiceFilterDataDto } from 'dtos/invoices/invoice-filter.dto';
import { InvoiceDto } from 'dtos/invoices/invoice.dto';
import QuoteValidateDto from 'dtos/invoices/quote-validate.dto';
import {
  PaginationFilterDto,
  PaginationResultDto,
} from 'dtos/utils/pagination-result.dto';
import MailingService from 'mailing/mailing.service';
import { MediaService } from 'media/media.service';
import ObjectiveService from 'objective/objective.service';
import { PrismaService } from 'prisma.service';
import SalesService from 'sales/sales.service';
import InvoiceFileService from './invoice-file.service';

@Injectable()
export default class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly objectiveService: ObjectiveService,
    private readonly salesService: SalesService,
    private readonly mailingService: MailingService,
    private readonly invoiceFileService: InvoiceFileService,
  ) {}

  async createInvoice(
    invoice: CreateInvoiceDto,
    invoiceFile: Express.Multer.File,
    enterpriseId: number,
  ) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
      include: { juridicShape: true },
    });
    if (!enterprise) throw new ForbiddenException();
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: invoice.customerId,
      },
    });
    if (!customer) throw new BadRequestException('customer.notFound');

    if (invoice.devisId) {
      const devis = await this.prisma.invoice.findFirst({
        where: { id: invoice.devisId, type: 'QUOTE' },
      });
      if (!devis) throw new BadRequestException('devis.notFound');
    }

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
        devisId: invoice.devisId,
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
    if (invoiceEntity && invoice.type === 'INVOICE') {
      await this.prisma.enterprise.update({
        where: { id: enterpriseId },
        data: {
          lastInvoiceNumber: enterprise.lastInvoiceNumber + 1,
        },
      });
      const invoiceAmount = invoice.invoiceLines
        .map((e) => e.quantity * e.unitPrice)
        .reduce((prev, curr) => prev + curr, 0);
      await this.objectiveService.increaseObjective(
        invoiceAmount * (invoice.excludeTva ? 1 : 1.2),
        enterpriseId,
        'SALES',
      );
      // Add in sales when enterprise is not AE or AE with sales > 77700 on precedent years
      const juridicShapeCode = enterprise.juridicShape.code;
      const currentSales = await this.salesService.getAmountByYear(
        invoice.date.getFullYear() - 1,
        enterprise.id,
      );
      if (juridicShapeCode != '10' && juridicShapeCode != '1000') {
        await this.salesService.updateSalesAmount(
          enterpriseId,
          invoice.date,
          invoiceAmount * (invoice.excludeTva ? 1 : 1.2),
        );
      } else if (
        (juridicShapeCode === '1000' || juridicShapeCode === '10') &&
        currentSales < 77700
      ) {
        await this.salesService.updateSalesAmount(
          enterpriseId,
          invoice.date,
          invoiceAmount * (invoice.excludeTva ? 1 : 1.2),
        );
      }
    }
    if (invoiceEntity.type === 'INVOICE') {
      this.mailingService.sendInvoice(invoiceEntity.id, customer.email);
    } else {
      this.mailingService.sendQuote(invoiceEntity.id, customer.email);
    }
  }

  async findAll(
    filter: PaginationFilterDto<InvoiceFilterDataDto>,
    enterpriseId?: number,
    customerId?: number,
  ): Promise<PaginationResultDto<InvoiceDto>> {
    let filterQuery: Prisma.InvoiceWhereInput = {
      ...(enterpriseId ? { enterpriseId } : {}),
      ...(customerId ? { customerId } : {}),
    };

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
      include: {
        invoiceLines: true,
        customer: true,
        enterprise: true,
        credits: { include: { creditLines: true } },
      },
      take: filter.pageSize,
      skip: filter.page * filter.pageSize,
    });

    const totalItems = await this.prisma.invoice.count({
      where: filterQuery,
    });

    return {
      data: invoices.map(
        (i) =>
          new InvoiceDto(
            i,
            i.invoiceLines,
            i.customer,
            i.enterprise,
            i.credits,
          ),
      ),
      totalItems: totalItems,
      page: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async findById(id: number, enterpriseId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { enterpriseId, id },
      include: {
        invoiceLines: true,
        customer: true,
        enterprise: true,
        credits: { include: { creditLines: true } },
      },
    });
    if (!invoice) throw new NotFoundException();

    return new InvoiceDto(
      invoice,
      invoice.invoiceLines,
      invoice.customer,
      invoice.enterprise,
      invoice.credits,
    );
  }

  async validate(
    id: number,
    customerId: number,
    model: QuoteValidateDto,
    userId: number,
  ) {
    const quote = await this.prisma.invoice.findFirst({
      where: { id, customerId, type: 'QUOTE' },
      include: {
        invoiceLines: true,
        customer: { include: { country: true } },
        enterprise: { include: { juridicShape: true } },
      },
    });
    if (!quote) throw new NotFoundException('quote.notFound');
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException();
    }

    if (!model.value) {
      await this.prisma.invoice.update({
        where: { id, customerId, type: 'QUOTE' },
        data: { status: 'REJECTED' },
      });
      return;
    }

    // Verify the code
    if (model.code !== quote.code || quote.codeDate < new Date()) {
      throw new BadRequestException('invoice.invalid.code');
    }

    // remplacer le fichier
    const file = await this.invoiceFileService.replaceQuote(
      {
        ...quote,
        status: 'VALIDATE',
        signedBy: userId,
        signedDate: new Date(),
      },
      quote.invoiceLines.map(
        (i) =>
          ({
            unitPrice: i.prixUnit,
            quantity: i.quantity,
            name: i.name,
          }) as CreateInvoiceLineDto,
      ),
      {
        enterprise: {
          id: quote.enterprise.id,
          name: quote.enterprise.name,
          siret: quote.enterprise.siret,
          tvaNumber: quote.enterprise.tvaNumber,
          mediaId: quote.enterprise.mediaId,
          address: quote.enterprise.address,
          city: quote.enterprise.city,
          zipCode: quote.enterprise.zipCode,
          countryId: quote.enterprise.countryId.toString(),
          juridicShape: quote.enterprise.juridicShape.code,
        },
        prefixe: quote.number.split('-')[0],
        lastNumber: parseInt(quote.number.split('-')[1]),
      },
      mapCustomerToDetailDto(quote.customer, quote.customer.country),
      quote.enterprise.mediaId !== null,
      user,
    );
    const media = await this.prisma.media.findFirst({
      where: { id: quote.mediaId },
    });
    const pathname =
      media.uploadedPath.split('.')[0] + '-validate' + media.extension;
    console.log(pathname);
    const mediaId = await this.mediaService.uploadBuffer(
      file,
      pathname,
      media.extension,
    );

    await this.prisma.invoice.update({
      where: { id, type: 'QUOTE', customerId },
      data: {
        status: 'VALIDATE',
        signedBy: userId,
        signedDate: new Date(),
        mediaId: mediaId,
        code: undefined,
        codeDate: undefined,
      },
    });
  }

  async sendCode(id: number, customerId: number) {
    const quote = await this.prisma.invoice.findFirst({
      where: { id, customerId, type: 'QUOTE' },
    });
    if (!quote) throw new NotFoundException('quote.notFound');
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId },
    });
    if (!customer) throw new ForbiddenException();

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    await this.prisma.invoice.update({
      where: { id, customerId, type: 'QUOTE' },
      data: {
        code: code,
        codeDate: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    this.mailingService.sendQuoteValidationMail(customer.email, code, quote);
  }

  async pay(id: number, customerId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, customerId, type: 'INVOICE' },
    });
    if (!invoice) throw new NotFoundException();
    await this.prisma.invoice.update({
      where: { id, customerId, type: 'INVOICE' },
      data: { status: 'PAYED' },
    });
  }
}
