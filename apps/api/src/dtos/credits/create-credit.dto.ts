import { ApiProperty } from '@nestjs/swagger';
import { CreateCreditData, CreateCreditLineData } from '@repo/shared-types';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateCreditLineDto implements CreateCreditLineData {
  @ApiProperty({ description: 'The title of the line credit' })
  title: string;
  @ApiProperty({ description: 'The price in TTC of the line credit' })
  price: number;
}

export default class CreateCreditDto implements CreateCreditData {
  @ApiProperty({ description: 'The title of credit' })
  @IsString()
  title: string;
  @ApiProperty({ description: 'The number of credit' })
  @IsString()
  number: string;
  @ApiProperty({ description: 'The invoiceId of credit' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  invoiceId: number;
  @ApiProperty({ description: 'The credit lines of credit' })
  @ApiProperty({ description: 'Invoice line for invoice' })
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  creditLines: CreateCreditLineDto[];
  @ApiProperty({
    description: 'Credit file',
    type: 'string',
    format: 'binary',
  })
  credit: File;
}
