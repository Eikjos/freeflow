import { Customer } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CustomerFilterDto implements Customer {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
  @IsString()
  name: string;
  @IsString()
  siret: string;
  @IsString()
  tvaNumber: string;
  @IsString()
  address: string;
  @IsString()
  zipCode: string;
  @IsString()
  city: string;
  @IsString()
  email: string;
  @IsString()
  phone: string;
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  countryId: number;
  [key: string]: string | number;
}
