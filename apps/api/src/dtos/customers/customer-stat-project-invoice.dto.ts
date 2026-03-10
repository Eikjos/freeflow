import { ApiProperty } from '@nestjs/swagger';
import {
  CustomerStatDataProjectInvoice,
  CustomerStatInvoice,
  CustomerStatProject,
} from '@repo/shared-types';

export default class CustomerStatProjectInvoiceDto
  implements CustomerStatDataProjectInvoice
{
  @ApiProperty({ description: 'project stat' })
  project: CustomerStatProjectDto;
  @ApiProperty({ description: 'The number of invoices' })
  invoice: CustomerStaInvoiceDto;
}

export class CustomerStatProjectDto implements CustomerStatProject {
  @ApiProperty({ description: 'The number of projects' })
  number: number;
}

export class CustomerStaInvoiceDto implements CustomerStatInvoice {
  @ApiProperty({ description: 'The amount of invoice to be payed' })
  amount: number;
  @ApiProperty({ description: 'The number of invoice' })
  number: number;
}
