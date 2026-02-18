import { ApiProperty } from '@nestjs/swagger';
import { CustomerCreateModel } from '@repo/shared-types';
import {
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export default class CustomerCreateDto implements CustomerCreateModel {
  @ApiProperty({ description: 'Customer email' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'Customer siret' })
  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'siret is not valid',
  })
  siret?: string;
  @ApiProperty({ description: 'Customer name' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Customer address' })
  @IsString()
  address: string;
  @ApiProperty({ description: 'Customer city' })
  @IsString()
  city: string;
  @ApiProperty({ description: 'Customer zipCode' })
  @IsString()
  zipCode: string;
  @ApiProperty({ description: 'Customer country' })
  @IsNumberString()
  countryId: string;
  @ApiProperty({ description: 'Customer TVA number' })
  @IsString()
  tvaNumber?: string;
  @ApiProperty({ description: 'Customer phone' })
  @IsPhoneNumber('FR')
  phone: string;
}
