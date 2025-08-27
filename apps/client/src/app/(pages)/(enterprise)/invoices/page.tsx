"use client";

import InvoiceFilter from "@components/organisms/invoice-filter";
import InvoiceTable from "@components/templates/invoice-table";
import { Button } from "@components/ui/button";
import { Pagination } from "@components/ui/pagination";
import { InvoiceFilterData, PaginationFilter } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getAllInvoiceQueryOptions } from "../../../../lib/api/invoices";

export default function InvoicePage() {
  const [filter, setFilter] = useState<InvoiceFilterData>();
  const paginationFilter: PaginationFilter<InvoiceFilterData> = {
    page: 0,
    pageSize: 10,
    filter: filter,
  };
  const { data, isLoading } = useQuery(
    getAllInvoiceQueryOptions(paginationFilter)
  );

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="font-amica text-4xl">Mes factures</h1>
        <div className="flex flex-row gap-4">
          <Button asChild variant={"outline"}>
            <Link href={"/devis/create"}>
              <Plus size={20} />
              Créer un devis
            </Link>
          </Button>
          <Button asChild>
            <Link href={"//create"}>
              <Plus size={20} />
              Créer une facture
            </Link>
          </Button>
        </div>
      </div>
      <InvoiceFilter
        className="mt-10"
        filter={filter}
        onChangeFilter={(filter) => setFilter(filter)}
      />
      <InvoiceTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
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
  );
}
