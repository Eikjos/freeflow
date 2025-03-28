import { ApiProperty } from '@nestjs/swagger';
import { EnterpriseCreateModel } from '@repo/shared-types';
import {
  IsEmail,
  IsInt,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEnterpriseDto implements EnterpriseCreateModel {
  @ApiProperty({ description: 'Enterprise juridic shape' })
  @IsString()
  juridicShape: string;
  @ApiProperty({ description: 'Enterprise name' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Enterprise siret' })
  @IsString()
  @Matches(/^\d{14}$/, { message: 'siret is not valid' })
  siret: string;
  @ApiProperty({ description: 'Enterprise address' })
  @IsString()
  address: string;
  @ApiProperty({ description: 'Enterprise zip code' })
  @IsString()
  zipCode: string;
  @ApiProperty({ description: 'Enterprise city' })
  @IsString()
  city: string;
  @ApiProperty({ description: 'Enterprise number tva' })
  @IsString()
  TVANumber: string;
  @ApiProperty({ description: 'Enterprise social capital' })
  @IsInt()
  socialCapital?: number;
  @ApiProperty({ description: 'Enterprise phone' })
  @IsPhoneNumber('FR')
  phone: string;
  @ApiProperty({ description: 'Enterprise email' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'The country Id of enterprise' })
  @IsNumberString()
  countryId: string;
  @ApiProperty({
    description: 'Enterprise logo',
    type: 'string',
    format: 'binary',
  })
  logo: File;
}
