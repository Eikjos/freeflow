import { ApiProperty } from '@nestjs/swagger'
import { EnterpriseStatData } from '@repo/shared-types'

export default class EnterpriseStatDto implements EnterpriseStatData {
  @ApiProperty({ description: 'Sales of enterprise' })
  sales: number
  @ApiProperty({ description: 'Expense of enterprise' })
  expenses: number
  @ApiProperty({ description: 'Profit of enterprise' })
  profit: number

  constructor(sales: number, expenses: number) {
    this.sales = sales
    this.expenses = expenses
    this.profit = sales - expenses
  }
}
