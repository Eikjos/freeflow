import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import CreateCreditDto from 'src/dtos/credits/create-credit.dto';
import { MediaService } from 'src/media/media.service';
import ObjectiveService from 'src/objective/objective.service';
import { PrismaService } from 'src/prisma.service';
import SalesService from 'src/sales/sales.service';

@Injectable()
export default class CreditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly objectiveService: ObjectiveService,
    private readonly saleService: SalesService,
  ) {}

  async create(
    model: CreateCreditDto,
    enterpriseId: number,
    credit: Express.Multer.File,
  ) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
      include: { juridicShape: true },
    });
    if (!enterprise) throw new ForbiddenException();
    // checking if the invoice id exist for this enterpriseId
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: model.invoiceId, enterpriseId },
      include: {
        credits: { include: { creditLines: true } },
        invoiceLines: true,
      },
    });
    if (!invoice) {
      throw new BadRequestException('invoice.notFound');
    }
    // checking if the credit amount not exceed the invoice amount
    const creditTotalAmount =
      invoice.credits
        .map((e) => e.creditLines.flatMap((c) => c.price))
        .flatMap((e) => e)
        .reduce((i, prev) => i + prev, 0) +
      model.creditLines.map((e) => e.price).reduce((e, prev) => e + prev, 0);
    const invoiceTotalAmount =
      invoice.invoiceLines
        .map((i) => i.prixUnit * i.quantity)
        .reduce((i, prev) => i + prev, 0) * (invoice.excludeTva ? 1 : 1.2);
    if (creditTotalAmount > invoiceTotalAmount) {
      throw new BadRequestException('credit.amountExceed');
    }

    // save the file
    const mediaId = await this.mediaService.upload(
      credit,
      `${enterpriseId}/credits/${new Date().getFullYear()}`,
    );

    // save the credit
    const creditEntity = await this.prisma.credit.create({
      data: {
        invoiceId: model.invoiceId,
        title: model.title,
        number: model.number,
        mediaId: mediaId,
        creditLines: {
          create: model.creditLines.map((e) => ({
            name: e.title,
            price: e.price,
          })),
        },
      },
    });

    if (creditEntity) {
      const amount = model.creditLines
        .map((e) => e.price)
        .reduce((prev, curr) => prev - curr, 0);
      await this.objectiveService.increaseObjective(
        amount,
        enterpriseId,
        'SALES',
      );
      // remove amount in sales
      const juridicShapeCode = enterprise.juridicShape.code;
      const currentSales = await this.saleService.getAmountByYear(
        invoice.date.getFullYear() - 1,
        enterprise.id,
      );
      if (juridicShapeCode != '10' && juridicShapeCode != '1000') {
        await this.saleService.updateSalesAmount(
          enterpriseId,
          invoice.date,
          amount,
        );
      } else if (
        (juridicShapeCode === '1000' || juridicShapeCode === '10') &&
        currentSales < 77700
      ) {
        await this.saleService.updateSalesAmount(
          enterpriseId,
          invoice.date,
          amount,
        );
      } else {
        await this.saleService.updateSalesAmount(
          enterpriseId,
          new Date(),
          amount,
        );
      }
    }
  }
}
