"use client";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import {
  InvoiceData,
  InvoiceFilter,
  InvoiceLineData,
  PaginationFilter,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { Plus, Printer, Send } from "lucide-react";
import Link from "next/link";
import { getAllInvoiceQueryOptions } from "../../../../lib/api/invoices";
import { invoiceStatusToString } from "../../../../lib/utils";

const columnsDef: ColumnDef<InvoiceData>[] = [
  {
    accessorKey: "number",
    header: "Numéro",
  },
  {
    accessorKey: "customer.name",
    header: "Client",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <>
        <span>{row.getValue("type") === "INVOICE" ? "Facture" : "Devis"}</span>
      </>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span>{dayjs(row.getValue("date")).format("DD/MM/YYYY")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <>
        <span
          className={clsx(
            row.getValue("status") === "PAYED" ||
              row.getValue("status") === "VALIDATE"
              ? "text-green-700"
              : "text-red-700"
          )}
        >
          {invoiceStatusToString(row.getValue("status"))}
        </span>
      </>
    ),
  },
  {
    accessorKey: "invoiceLines",
    header: "Montant",
    cell: ({ row }) => {
      const invoiceLines: InvoiceLineData[] = row.getValue("invoiceLines");
      const totalAmount =
        invoiceLines
          .map((e) => e.quantity * e.unitPrice)
          .reduce((prev, a) => prev + a, 0) *
        (row.original.excludeTva === true ? 1 : 1.2);
      return (
        <>
          <span>{totalAmount} €</span>
        </>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "",
    cell: () => (
      <div className="flex flex-row justify-end gap-5 mr-10 ml-auto">
        <Printer size={15}></Printer>
        <Send size={15}></Send>
      </div>
    ),
  },
];

export default function InvoicePage() {
  const filter: PaginationFilter<InvoiceFilter> = {
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
      <DataTable
        columns={columnsDef}
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        pageSize={filter.pageSize}
        className="mt-10"
      />
    </>
  );
}
