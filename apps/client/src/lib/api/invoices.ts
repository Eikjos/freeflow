import {
  InvoiceData,
  InvoiceFilter,
  PaginationFilter,
  PaginationResult,
} from "@repo/shared-types";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllInvoice = (filter: PaginationFilter<InvoiceFilter>) => {
  const query = generateQueryString(filter);
  return client<PaginationResult<InvoiceData>>(`invoices?${query}`);
};

export const getAllInvoiceQueryOptions = (
  filter: PaginationFilter<InvoiceFilter>
) => ({
  queryFn: () => getAllInvoice(filter),
  queryKey: ["invoices", filter],
  retry: false,
});
