import { Credit, CreditLine } from '@prisma/client'
import { CreditForInvoiceData } from '@repo/shared-types'

export class CreditForInvoiceDto implements CreditForInvoiceData {
  id: number
  totalAmount: number
}

export const mapToCreditForInvoiceDto = (
  credit: Credit & { creditLines: CreditLine[] },
): CreditForInvoiceDto => {
  const totalAmount = credit.creditLines.reduce((sum, il) => {
    return sum + il.price
  }, 0)
  return {
    id: credit.id,
    totalAmount,
  }
}
