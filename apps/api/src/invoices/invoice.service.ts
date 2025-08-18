import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateInvoiceDto } from 'src/dtos/invoices/invoice-create.dto';
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
      `${enterprise.id}/invoices/${invoice.date.getFullYear()}`,
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
        type: 'INVOICE',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING_PAYED',
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
}
