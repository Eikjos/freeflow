import { InvoiceType, StatusInvoice } from '@prisma/client';
import { InvoiceFilter } from '@repo/shared-types';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class InvoiceFilterDto implements InvoiceFilter {
  @IsString()
  number: string;
  @IsNumber()
  customerId: number;
  type: InvoiceType;
  status: StatusInvoice;
  @IsDate()
  startDate: Date;
  @IsDate()
  endData: Date;
  [key: string]: string | number | Date;
}
