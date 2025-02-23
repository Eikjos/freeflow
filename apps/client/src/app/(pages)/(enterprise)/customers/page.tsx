"use client";

import { DataTable } from "@components/ui/data-table";
import { CustomerModel } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";

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
];

export default function CustomersPage() {
  return (
    <div className="w-full">
      <h1 className="font-amica text-3xl">Les clients de ..........</h1>
      <DataTable columns={columnDefs} data={[]} className="w-full mx-auto" />
    </div>
  );
}
