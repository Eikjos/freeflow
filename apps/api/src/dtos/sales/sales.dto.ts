import { Sales } from '@prisma/client';

export default class SaleDto {
  id: number;
  year: number;
  month: number;
  enterpriseId: number;
  amount: number;

  constructor(sale: Sales) {
    this.id = sale.id;
    this.enterpriseId = sale.enterpriseId;
    this.year = sale.year;
    this.month = sale.month;
    this.amount = sale.number;
  }
}
