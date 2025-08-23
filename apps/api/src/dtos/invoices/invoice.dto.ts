import { Customer, Invoice, InvoiceLine } from '@prisma/client';
import {
  InvoiceData,
  InvoiceLineData,
  InvoiceStatus,
  InvoiceType,
} from '@repo/shared-types';
import { CustomerDto, mapCustomerToDto } from '../customers/customer.dto';

export class InvoiceDto implements InvoiceData {
  id: number;
  number: string;
  title: string;
  date: Date;
  invoiceLines: InvoiceLineDto[];
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  mediaId: number;
  customer: CustomerDto;
}

export const mapToDto = (
  invoice: Invoice,
  invoiceLines: InvoiceLine[],
  customer: Customer,
): InvoiceDto => {
  const totalAmount = invoiceLines.reduce((sum, il) => {
    return sum + il.quantity * il.prixUnit;
  }, 0);
  return {
    id: invoice.id,
    title: invoice.name,
    number: invoice.number,
    date: invoice.date,
    type: invoice.type,
    status: invoice.status,
    invoiceLines: invoiceLines.map((e) => mapInvoiceLineToDto(e)),
    totalAmount: totalAmount,
    customer: mapCustomerToDto(customer),
    mediaId: invoice.mediaId,
  };
};

export const mapInvoiceLineToDto = (
  invoiceLine: InvoiceLine,
): InvoiceLineDto => ({
  id: invoiceLine.id,
  name: invoiceLine.name,
  quantity: invoiceLine.quantity,
  unitPrice: invoiceLine.prixUnit,
});
export class InvoiceLineDto implements InvoiceLineData {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}
