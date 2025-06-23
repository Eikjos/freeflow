"use client";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Printer, Send } from "lucide-react";
import Link from "next/link";

type Invoice = {
  id: number;
  amount: number;
  status: "PAYED";
  customer: string;
  type: "INVOICE" | "DEVIS";
};

const data: Invoice[] = [
  {
    id: 1,
    amount: 125.0,
    status: "PAYED",
    customer: "Client",
    type: "INVOICE",
  },
  {
    id: 2,
    amount: 125.0,
    status: "PAYED",
    customer: "Client",
    type: "INVOICE",
  },
  {
    id: 3,
    amount: 125.0,
    status: "PAYED",
    customer: "Client",
    type: "INVOICE",
  },
  {
    id: 4,
    amount: 125.0,
    status: "PAYED",
    customer: "Client",
    type: "INVOICE",
  },
  {
    id: 5,
    amount: 125.0,
    status: "PAYED",
    customer: "Client",
    type: "INVOICE",
  },
];

const columnsDef: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "",
  },
  {
    accessorKey: "customer",
    header: "Client",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <>
        <span>{row.getValue("type")}</span>
      </>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <>
        <span
          className={clsx(
            row.getValue("status") === "PAYED"
              ? "text-green-700"
              : "text-red-700"
          )}
        >
          {row.getValue("status")}
        </span>
      </>
    ),
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => (
      <>
        <span>{row.getValue("amount")} €</span>
      </>
    ),
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
  return (
    <>
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="font-amica text-4xl">Mes factures</h1>
        <Button asChild>
          <Link href={"/invoices/create"}>Créer une facture</Link>
        </Button>
      </div>
      <DataTable
        columns={columnsDef}
        data={data}
        pageSize={2}
        className="mt-10"
      />
    </>
  );
}
