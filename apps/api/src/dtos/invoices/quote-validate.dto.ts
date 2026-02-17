import { ApiProperty } from '@nestjs/swagger'
import { QuoteValidateData } from '@repo/shared-types'
import { IsBoolean, IsString } from 'class-validator'

export default class QuoteValidateDto implements QuoteValidateData {
  @ApiProperty({ description: 'Indicate if the quote is validate' })
  @IsBoolean()
  value: boolean
  @ApiProperty({ description: 'Code receive by user for confirm identity' })
  @IsString()
  code?: string
}
