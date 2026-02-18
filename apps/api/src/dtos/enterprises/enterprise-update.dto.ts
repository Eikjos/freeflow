import { ApiProperty } from '@nestjs/swagger';
import { EditEnterpriseData } from '@repo/shared-types';
import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export default class EnterpriseUpdateDto implements EditEnterpriseData {
  [key: string]: any;
  @IsString()
  @ApiProperty({ description: 'Enterprise name' })
  name: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise tvaNumber' })
  tvaNumber: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise juridic shape' })
  juridicShapeId: string;
  @IsNumberString()
  @ApiProperty({ description: 'Enterprise country id' })
  countryId: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise address' })
  address: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise  city' })
  city: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise zip code' })
  zipCode: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise email' })
  email: string;
  @IsString()
  @ApiProperty({ description: 'Enterprise phone' })
  phone: string;
  @ApiProperty({
    description: 'Enterprise logo',
    type: 'string',
    format: 'binary',
  })
  logo?: File;
  @IsString()
  @ApiProperty({ description: 'Invoice prefixe for enterprise' })
  invoicePrefixe: string;
  @ApiProperty({ description: 'The last invoice number' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  invoiceNumber: number;
}
