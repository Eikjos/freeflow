import { ApiProperty } from '@nestjs/swagger'
import { Sales } from '@prisma/client'
import { SaleData } from '@repo/shared-types'

export default class SaleDto implements SaleData {
  @ApiProperty({ description: 'id of sales' })
  id: number
  @ApiProperty({ description: 'Year of sales' })
  year: number
  @ApiProperty({ description: 'Month of sales' })
  month: number
  @ApiProperty({ description: 'EnterpriseId of sales' })
  enterpriseId: number
  @ApiProperty({ description: 'amount of sales' })
  amount: number

  constructor(sale: Sales) {
    this.id = sale.id
    this.enterpriseId = sale.enterpriseId
    this.year = sale.year
    this.month = sale.month
    this.amount = sale.number
  }
}
