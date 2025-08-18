import { ApiProperty } from '@nestjs/swagger';
import { InvoiceCreateData, InvoiceLineData } from '@repo/shared-types';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateInvoiceDto implements InvoiceCreateData {
  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  number: string;
  @ApiProperty({ description: 'Invoice title' })
  @IsString()
  title: string;
  @ApiProperty({ description: 'Invoice date' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
  @ApiProperty({ description: 'Invoice customer id' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
  @ApiProperty({ description: 'exclude TVA for invoice' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeTva?: boolean;
  @ApiProperty({ description: 'Invoice line for invoice' })
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  invoiceLines: CreateInvoiceLineDto[];
  @ApiProperty({
    description: 'Invoice file',
    type: 'string',
    format: 'binary',
  })
  invoice: File;
}

export class CreateInvoiceLineDto implements InvoiceLineData {
  @ApiProperty({ description: 'Invoice line name' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Invoice line quantity' })
  @IsNumber()
  quantity: number;
  @ApiProperty({ description: 'Invoice line unit price in HT' })
  @IsNumber()
  unitPrice: number;
}
