import { ApiProperty } from '@nestjs/swagger';
import { EnterpriseCreateModel } from '@repo/shared-types';

export class CreateEnterpriseDto implements EnterpriseCreateModel {
  @ApiProperty({ description: 'Enterprise juridic shape' })
  juridicShape: string;
  @ApiProperty({ description: 'Enterprise name' })
  name: string;
  @ApiProperty({ description: 'Enterprise siret' })
  siret: string;
  @ApiProperty({ description: 'Enterprise address' })
  address: string;
  @ApiProperty({ description: 'Enterprise zip code' })
  zipCode: string;
  @ApiProperty({ description: 'Enterprise city' })
  city: string;
  @ApiProperty({ description: 'Enterprise number tva' })
  TVANumber: string;
  @ApiProperty({ description: 'Enterprise social capital' })
  socialCapital?: number;
  @ApiProperty({ description: 'Enterprise phone' })
  phone: string;
  @ApiProperty({ description: 'Enterprise email' })
  email: string;
  @ApiProperty({ description: 'The country Id of enterprise' })
  countryId: string;
}

export class CreateEnterpriseWithLogoDto extends CreateEnterpriseDto {
  @ApiProperty({
    description: 'Enterprise logo',
    type: 'string',
    format: 'binary',
  })
  logo: Express.Multer.File;
}
