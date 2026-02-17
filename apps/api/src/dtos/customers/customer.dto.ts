import { Country, Customer } from '@prisma/client'
import { CustomerDetailModel, CustomerModel } from '@repo/shared-types'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CustomerDto implements CustomerModel {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number
  @IsString()
  name: string
  @IsString()
  @IsOptional()
  siret?: string
  @IsString()
  address: string
  @IsString()
  city: string
  @IsString()
  zipCode: string
  @IsString()
  country: string
  @IsString()
  email: string
  @IsString()
  phone: string
}

export class CustomerDetailDto
  extends CustomerDto
  implements CustomerDetailModel
{
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  countryId: number
  @IsString()
  tvaNumber: string;
  [key: string]: string | number
}

export function mapCustomerToDto(customer: Customer, country?: Country) {
  const { createdAt, token, tokenDate, ...c } = customer
  return { ...c, country: country?.name } as CustomerDetailDto
}

export function mapCustomerToDetailDto(customer: Customer, country?: Country) {
  return {
    ...customer,
    country: country?.name,
  } as CustomerDetailModel
}
