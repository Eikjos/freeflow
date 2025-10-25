import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async getAmountByYear(year: number, enterpriseId: number) {
    return (
      await this.prismaService.sales.aggregate({
        where: { enterpriseId: enterpriseId, year: year },
        _sum: { number: true },
      })
    )._sum.number;
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
