import { CountryData } from '@repo/shared-types';
import { queryOptions } from '@tanstack/react-query';
import { client } from '../client';

export const getAllCountries = async () => {
  return await client<CountryData[]>(`countries`);
};

export const getCountryById = async (id: number) => {
  return await client<CountryData>(`countries/${id}`);
};

export const getAllCountriesQueryOptions = () =>
  queryOptions({
    queryFn: getAllCountries,
    queryKey: ['countries'],
    retry: false,
  });

export const getCountryByIdQueryOptions = (id: number) =>
  queryOptions({
    queryFn: () => getCountryById(id),
    queryKey: ['countries', id],
    retry: false,
  });
