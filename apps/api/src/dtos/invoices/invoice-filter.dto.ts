import { InvoiceType, StatusInvoice } from '@prisma/client'
import { InvoiceFilterData } from '@repo/shared-types'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class InvoiceFilterDataDto implements InvoiceFilterData {
  @IsString()
  number: string
  @IsNumber()
  customerId: number
  type: InvoiceType
  status: StatusInvoice
  @IsDate()
  startDate: Date
  @IsDate()
  endDate: Date;
  [key: string]: string | number | Date
}
