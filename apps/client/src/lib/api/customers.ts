import {
  CustomerDetailModel,
  CustomerModel,
  PaginationFilter,
  PaginationResult,
} from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllCustomers = (
  pagination: PaginationFilter<CustomerModel>
) => {
  const query = generateQueryString(pagination);
  console.log(`customers?${query}`);
  return client<PaginationResult<CustomerModel>>(`customers?${query}`);
};

export const getCustomerById = (id: string) => {
  return client<CustomerDetailModel>(`customers/${id}`);
};

export const getAllCustomersQueryOptions = (
  pagination: PaginationFilter<CustomerModel>
) => ({
  queryFn: () => getAllCustomers(pagination),
  queryKey: ["customers", pagination],
  retry: false,
});

export const getCustomerByIdOptions = (id: string) =>
  queryOptions({
    queryFn: () => getCustomerById(id),
    queryKey: ["customers", id],
    retry: false,
  });
