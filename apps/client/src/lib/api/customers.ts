import {
  CustomerDetailModel,
  CustomerModel,
  Pagination,
  PaginationResult,
} from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllCustomers = (pagination: Pagination) => {
  const query = generateQueryString(pagination);
  return client<PaginationResult<CustomerModel>>(`customers?${query}`);
};

export const getCustomerById = (id: string) => {
  return client<CustomerDetailModel>(`customers/${id}`);
};

export const getAllCustomersQueryOptions = (pagination: Pagination) =>
  queryOptions({
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
