import {
  InvoiceData,
  InvoiceFilterData,
  PaginationFilter,
  PaginationResult,
} from "@repo/shared-types";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllInvoice = (filter: PaginationFilter<InvoiceFilterData>) => {
  const query = generateQueryString(filter);
  return client<PaginationResult<InvoiceData>>(`invoices?${query}`);
};

export const getAllInvoiceQueryOptions = (
  filter: PaginationFilter<InvoiceFilterData>
) => ({
  queryFn: () => getAllInvoice(filter),
  queryKey: ["invoices", filter],
  retry: false,
});

export const getInvoiceById = (id: number) =>
  client<InvoiceData>(`invoices/${id}`);

export const getInvoiceByIdQueryOptions = (id: number) => ({
  queryFn: () => getInvoiceById(id),
  queryKey: ["invoices", id],
  retry: false,
});
