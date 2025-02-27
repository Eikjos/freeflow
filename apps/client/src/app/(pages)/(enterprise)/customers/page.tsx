"use client";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import { CustomerModel } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { GetCustomers } from "actions/customer";
import { PenBoxIcon, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CustomersPage() {
  const t = useTranslations();
  const columnDefs: ColumnDef<CustomerModel>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorFn: (row) => row.siret ?? "Pas renseigné",
      header: "Siret",
    },
    {
      accessorFn: (row) => `${row.city}, ${t(row.country)}`,
      header: "Localisation",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flew-row gap-4">
          <PenBoxIcon size={18} />
          <Trash size={18} color="red" />
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="font-amica text-4xl">Les clients de ..........</h1>
        <Button asChild>
          <Link href={"/customers/create"}>
            Ajouter <Plus />
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columnDefs}
        apiData={GetCustomers}
        pageSize={20}
        className="w-full mx-auto"
      />
    </div>
  );
}
