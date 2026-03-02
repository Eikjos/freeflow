import { ApiProperty } from '@nestjs/swagger';
import { Customer, Opinion } from '@prisma/client';
import { OpinionData } from '@repo/shared-types';

export default class OpinionDto implements OpinionData {
  @ApiProperty({ description: 'Opinion id' })
  id: number;
  @ApiProperty({ description: 'Opinion content' })
  content: string;
  @ApiProperty({ description: 'Opinion rate' })
  rate: number;
  @ApiProperty({ description: 'Opinion customer' })
  customer: string;
  @ApiProperty({ description: 'Opinion createdAt' })
  createdAt: Date;
  @ApiProperty({ description: 'Opinion enterprise id' })
  enterpriseId: number;

  constructor(opinion: Opinion, customer: Customer) {
    this.id = opinion.id;
    this.content = opinion.content;
    this.rate = opinion.rate.toNumber();
    this.customer = customer.companyName;
    this.createdAt = opinion.createdAt;
    this.enterpriseId = opinion.enterpriseId;
  }
}

export function mapForApiPublic(o: Opinion, c: Customer) {
  var opinion = new OpinionDto(o, c);
  opinion.customer = c.companyName;
  return opinion;
}
