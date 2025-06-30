import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Enterprise logo',
    type: 'string',
    format: 'binary',
  })
  invoice: File;
}
