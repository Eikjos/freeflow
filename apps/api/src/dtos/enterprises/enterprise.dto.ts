import { ApiProperty } from '@nestjs/swagger';
import { Enterprise } from '@prisma/client';
import { EnterpriseData } from '@repo/shared-types';

export default class EnterpriseDto implements EnterpriseData {
  constructor(enterprise: Enterprise) {
    this.id = enterprise.id;
    this.name = enterprise.name;
    this.siret = enterprise.siret;
    this.tvaNumber = enterprise.tvaNumber;
    this.juridicShapeId = enterprise.juridicShapeId;
    this.address = enterprise.address;
    this.city = enterprise.city;
    this.countryId = enterprise.countryId;
    this.email = enterprise.email;
    this.mediaId = enterprise.mediaId;
    this.zipCode = enterprise.zipCode;
    this.phone = enterprise.phone;
    this.invoiceNumber = enterprise.lastInvoiceNumber;
    this.invoicePrefixe = enterprise.prefixeInvoice;
  }

  @ApiProperty({ description: 'The id of enterprise' })
  id: number;
  @ApiProperty({ description: 'The name of enterprise' })
  name: string;
  @ApiProperty({ description: 'The siret of enterprise' })
  siret: string;
  @ApiProperty({ description: 'The tva number of enterprise' })
  tvaNumber?: string;
  @ApiProperty({ description: 'The juridic shape id of enterprise' })
  juridicShapeId: string;
  @ApiProperty({ description: 'The country id of enterprise' })
  countryId: number;
  @ApiProperty({ description: 'The address of enterprise' })
  address: string;
  @ApiProperty({ description: 'The zip code of enterprise' })
  zipCode: string;
  @ApiProperty({ description: 'The city of enterprise' })
  city: string;
  @ApiProperty({ description: 'The email of enterprise' })
  email: string;
  @ApiProperty({ description: 'The phone of enterprise' })
  phone: string;
  @ApiProperty({ description: 'The media id of enterprise' })
  mediaId?: number;
  @ApiProperty({ description: 'The invoice prefixe of enterprise' })
  invoicePrefixe: string;
  @ApiProperty({ description: 'The invoice number of enterprise' })
  invoiceNumber: number;
}
