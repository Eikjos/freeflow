import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import PrevisionDto from 'src/dtos/sales/prevision.dto';
import SaleDto from 'src/dtos/sales/sales.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class SalesService {
  constructor(private readonly prismaService: PrismaService) {}

  // --
  async getCurrentSales(enterpriseId: number) {
    return (
      await this.prismaService.sales.aggregate({
        where: { enterpriseId: enterpriseId, year: new Date().getFullYear() },
        _sum: { number: true },
      })
    )._sum.number;
  }

  async findAllByYear(year: number, enterpriseId: number) {
    const sales = await this.prismaService.sales.findMany({
      where: { year: year, enterpriseId },
    });
    if (!sales) throw new HttpException('NoContent', HttpStatus.NO_CONTENT);
    return sales.map((s) => new SaleDto(s));
  }

  async getAmountByYear(enterpriseId: number, year?: number) {
    let filterQuery: Prisma.SalesWhereInput = { enterpriseId };
    if (year !== undefined) {
      filterQuery = {
        ...filterQuery,
        year: year,
      };
    }
    return (
      await this.prismaService.sales.aggregate({
        where: filterQuery,
        _sum: { number: true },
      })
    )._sum.number;
  }

  async getPrevisions(enterpriseId: number) {
    const enterprise = await this.prismaService.enterprise.findFirst({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new ForbiddenException();
    const now = new Date();
    const year = now.getFullYear();
    const dateFrom = new Date(`${year}-01-01`);

    const result = await this.prismaService.$queryRaw<PrevisionDto[]>`
      WITH months AS (
        SELECT 
          generate_series(
            DATE_TRUNC('month', ${dateFrom}::timestamp),
            DATE_TRUNC('month', ${now}::timestamp),
            interval '1 month'
          ) AS month_date
        ),
        monthly_sales AS (
          SELECT
            EXTRACT(YEAR FROM m.month_date)::INT AS year,
            EXTRACT(MONTH FROM m.month_date)::INT AS month,
            TO_CHAR(m.month_date, 'YYYY-MM') AS month_label,
            COALESCE(SUM(s.number), 0) AS monthly_total
          FROM months m
          LEFT JOIN "Sales" s
            ON s."year" = EXTRACT(YEAR FROM m.month_date)::INT
            AND s."month" = EXTRACT(MONTH FROM m.month_date)::INT - 1 
            AND s."enterpriseId" = ${enterpriseId}
          GROUP BY m.month_date
          ORDER BY m.month_date
        )
        SELECT
          month_label AS month,
          SUM(monthly_total) OVER (ORDER BY year, month) AS sale
        FROM monthly_sales;
      `;

    const devis = await this.prismaService.invoice.findMany({
      where: {
        AND: [
          { type: 'QUOTE', enterpriseId: enterpriseId },
          {
            OR: [
              { status: 'WAITING_VALIDATION' },
              {
                AND: [{ status: 'VALIDATE' }, { NOT: { invoice: null } }],
              },
            ],
          },
        ],
      },
      include: { invoiceLines: true },
    });
    const total = devis.reduce(
      (prev, curr) =>
        curr.invoiceLines.reduce(
          (prev1, curr1) => curr1.prixUnit * curr1.quantity + prev1,
          0,
        ) *
          (curr.excludeTva ? 1 : 1.2) +
        prev,
      0,
    );
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs().startOf('year').add(i, 'month').format('YYYY-MM'),
    );

    // Complète les mois manquants
    return months.map((m, index) => {
      const r = result[index];
      return {
        month: m,
        sale: r ? Number(r.sale) : null,
        prevision:
          index == result.length - 2
            ? r
              ? Number(r.sale)
              : 0
            : index === result.length - 1
              ? (r ? Number(r.sale) : 0) + total
              : null,
      } as PrevisionDto;
    });
  }

  async updateSalesAmount(enterpriseId: number, date: Date, value: number) {
    const sale = await this.prismaService.sales.findFirst({
      where: { enterpriseId, month: date.getMonth(), year: date.getFullYear() },
    });
    if (sale) {
      await this.prismaService.sales.update({
        where: { id: sale.id },
        data: {
          number: sale.number + value,
        },
      });
    } else {
      await this.prismaService.sales.create({
        data: {
          enterpriseId,
          month: date.getMonth(),
          year: date.getFullYear(),
          number: value,
        },
      });
    }
  }
}
