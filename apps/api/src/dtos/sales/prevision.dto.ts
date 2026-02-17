import { ApiProperty } from '@nestjs/swagger'
import { PrevisionData } from '@repo/shared-types'

export default class PrevisionDto implements PrevisionData {
  @ApiProperty({ description: 'The month of prevision' })
  month: string
  @ApiProperty({ description: 'The amount of sales of prevision' })
  sale: number | null
  @ApiProperty({ description: 'The amount of prevision of prevision' })
  prevision: number | null
}
