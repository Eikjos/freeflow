"use client";

import { DataTable } from "@components/ui/data-table";
import { InvoiceData, InvoiceLineData } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { Printer, Send } from "lucide-react";
import { getMediaUrl, invoiceStatusToString } from "../../../lib/utils";

export type InvoiceTableProps = {
  data: InvoiceData[];
  isLoading: boolean;
  className?: string;
};

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
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-end gap-5 mr-10 ml-auto">
          <a href={getMediaUrl(row.original.mediaId)}>
            <Printer size={15}></Printer>
          </a>
          <Send size={15}></Send>
        </div>
      );
    },
  },
];

export default function InvoiceTable({
  data,
  isLoading,
  className,
}: InvoiceTableProps) {
  return (
    <DataTable
      columns={columnsDef}
      data={data ?? []}
      isLoading={isLoading}
      className={className}
    />
  );
}
