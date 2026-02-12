"use client";

import InvoiceFilter from "@components/organisms/invoice-filter";
import InvoiceTable from "@components/templates/invoice-table";
import { Pagination } from "@components/ui/pagination";
import { InvoiceFilterData, PaginationFilter } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { getAllInvoiceQueryOptions } from "../../../../../lib/api/invoices";

export default function CustomerInvoicePage() {
  const t = useTranslations();
  const [filter, setFilter] = useState<InvoiceFilterData>();
  const paginationFilter: PaginationFilter<InvoiceFilterData> = {
    page: 0,
    pageSize: 10,
    filter: filter,
  };
  const { data, isLoading, refetch } = useQuery(
    getAllInvoiceQueryOptions(paginationFilter)
  );

  const handleRefresh = () => {
    refetch().catch(() => {
      toast.error(t("common.errorHandler"))
    })
  }

  return (
     <>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="font-amica text-4xl">{t("invoice.titlePage")}</h1>
      </div>
      <InvoiceFilter
        className="mt-10"
        onChangeFilter={(filter) => setFilter(filter)}
        isCustomer
      />
      <InvoiceTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        isCustomer
        onRefetch={handleRefresh}
        className="mt-10"
      />
      <Pagination
        className="mt-10"
        page={paginationFilter.page}
        pageSize={paginationFilter.pageSize}
        onChangePage={(value) => (paginationFilter.page = value)}
        totalItems={data?.data?.totalItems ?? 0}
      />
    </>
  )
}