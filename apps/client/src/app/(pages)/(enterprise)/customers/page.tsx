"use client";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import { CustomerModel } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";

const columnDefs: ColumnDef<CustomerModel>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "siret",
    header: "Siret",
  },
  {
    accessorFn: (row) => `${row.city}, ${row.country}`,
    header: "Localisation",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <Button variant={"outline"}>Supp</Button>
      </div>
    ),
  },
];

export default function CustomersPage() {
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

      <DataTable columns={columnDefs} data={[]} className="w-full mx-auto" />
    </div>
  );
}
