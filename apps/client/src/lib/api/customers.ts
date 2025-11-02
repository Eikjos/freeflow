import {
  CustomerDetailModel,
  CustomerModel,
  CustomerStatData,
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

export const getStats = (months: number) =>
  client<CustomerStatData[]>(`customers/stats?months=${months}`, {
    method: "GET",
  });

export const getStatsQueryOptions = (months: number) =>
  queryOptions({
    queryFn: () => getStats(months),
    queryKey: ["customer", "stats", months],
    retry: false,
  });
