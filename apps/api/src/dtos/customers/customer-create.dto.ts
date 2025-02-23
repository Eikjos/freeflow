import { ApiProperty } from '@nestjs/swagger';
import { CustomerCreateModel } from '@repo/shared-types';

export default class CustomerCreateDto implements CustomerCreateModel {
  @ApiProperty({ description: 'Customer email' })
  email: string;
  @ApiProperty({ description: 'Customer siret' })
  siret?: string;
  @ApiProperty({ description: 'Customer name' })
  name: string;
  @ApiProperty({ description: 'Customer address' })
  address: string;
  @ApiProperty({ description: 'Customer city' })
  city: string;
  @ApiProperty({ description: 'Customer zipCode' })
  zipCode: string;
  @ApiProperty({ description: 'Customer country' })
  countryId: number;
  @ApiProperty({ description: 'Customer TVA number' })
  TVANumber?: string;
  @ApiProperty({ description: 'Customer phone' })
  phone: string;
}
