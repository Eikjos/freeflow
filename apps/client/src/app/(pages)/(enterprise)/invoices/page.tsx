"use client";

import InvoiceFilter from "@components/organisms/invoice-filter";
import InvoiceTable from "@components/templates/invoice-table";
import { Button } from "@components/ui/button";
import { Pagination } from "@components/ui/pagination";
import { InvoiceFilterData, PaginationFilter } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllInvoiceQueryOptions } from "../../../../lib/api/invoices";

export default function InvoicePage() {
  const filter: PaginationFilter<InvoiceFilterData> = {
    page: 0,
    pageSize: 10,
  };
  const { data, isLoading } = useQuery(getAllInvoiceQueryOptions(filter));

  console.log("Invoices query result:", data);

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
      <InvoiceFilter className="mt-10" />
      <InvoiceTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        className="mt-10"
      />
      <Pagination
        className="mt-10"
        page={filter.page}
        pageSize={filter.pageSize}
        onChangePage={(value) => (filter.page = value)}
        totalItems={data?.data?.totalItems ?? 0}
      />
    </>
  );
}
