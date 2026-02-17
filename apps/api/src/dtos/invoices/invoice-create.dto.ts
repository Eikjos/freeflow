import { ApiProperty } from '@nestjs/swagger'
import { InvoiceType } from '@prisma/client'
import { InvoiceCreateData, InvoiceLineCreateData } from '@repo/shared-types'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateInvoiceDto implements InvoiceCreateData {
  [key: string]: any
  @ApiProperty({ description: 'Invoice type' })
  @IsEnum(InvoiceType)
  type: InvoiceType
  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  number: string
  @ApiProperty({ description: 'Invoice title' })
  @IsString()
  title: string
  @ApiProperty({ description: 'Invoice date' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date
  @ApiProperty({ description: 'Invoice customer id' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number
  @ApiProperty({ description: 'exclude TVA for invoice' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeTva?: boolean
  @ApiProperty({ description: 'Invoice line for invoice' })
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  invoiceLines: CreateInvoiceLineDto[]
  @ApiProperty({
    description: 'Invoice file',
    type: 'string',
    format: 'binary',
  })
  invoice: File
  @ApiProperty({ description: 'devisId related to the invoice' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      return Number(value)
    }
    return undefined
  })
  devisId?: number
}

export class CreateInvoiceLineDto implements InvoiceLineCreateData {
  @ApiProperty({ description: 'Invoice line name' })
  @IsString()
  name: string
  @ApiProperty({ description: 'Invoice line quantity' })
  @IsNumber()
  quantity: number
  @ApiProperty({ description: 'Invoice line unit price in HT' })
  @IsNumber()
  unitPrice: number
}
