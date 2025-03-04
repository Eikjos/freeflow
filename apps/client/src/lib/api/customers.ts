import {
  CustomerModel,
  Pagination,
  PaginationResult,
} from "@repo/shared-types";
import { client } from "../client";
import { queryOptions } from "@tanstack/react-query";
import { generateQueryString } from "../utils";

export const getAllCustomers = (pagination: Pagination) => {
  const query = generateQueryString(pagination);
  return client<PaginationResult<CustomerModel>>(`customers?${query}`);
};

export const getAllCustomersQueryOptions = (pagination: Pagination) =>
  queryOptions({
    queryFn: () => getAllCustomers(pagination),
    queryKey: ["customers"],
    retry: false,
  });
