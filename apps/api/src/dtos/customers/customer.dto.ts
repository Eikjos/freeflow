import { Country, Customer } from '@prisma/client';
import { CustomerDetailModel, CustomerModel } from '@repo/shared-types';

export class CustomerDto implements CustomerModel {
  id: number;
  name: string;
  siret?: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
}

export class CustomerDetailDto
  extends CustomerDto
  implements CustomerDetailModel
{
  countryId: number;
  tvaNumber: string;
}

export function mapCustomerToDto(customer: Customer, country?: Country) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { countryId, ...c } = customer;
  return { ...c, country: country?.name } as CustomerModel;
}

export function mapCustomerToDetailDto(customer: Customer, country?: Country) {
  return {
    ...customer,
    country: country?.name,
  } as CustomerDetailModel;
}
