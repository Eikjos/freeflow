import { ApiProperty } from '@nestjs/swagger'
import { EnterpriseInformation, InvoiceInformation } from '@repo/shared-types'

export default class InvoiceInformationDto implements InvoiceInformation {
  @ApiProperty({ description: 'Enterprise information for an invoice' })
  enterprise: EnterpriseInformation
  @ApiProperty({ description: 'Prefixe for an invoice' })
  prefixe: string
  @ApiProperty({ description: 'Last number use for an invoice' })
  lastNumber: number
}
