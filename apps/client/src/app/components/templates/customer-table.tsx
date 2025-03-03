"use client";

import { Button } from "@components/ui/button";
import { DataTable } from "@components/ui/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { CustomerModel } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { GetCustomers } from "actions/customer";
import { PenBoxIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
export default function CustomerTable() {
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
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flew-row gap-4">
          <PenBoxIcon size={18} />
          <Dialog>
            <DialogTrigger asChild>
              <Trash color="red" size={18} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-semibold text-xl">
                  Suppression du client : {row.getValue("name")}
                </DialogTitle>
              </DialogHeader>
              <p>
                Êtes-vous sur de vouloir supprimer le client{" "}
                {row.getValue("name")} ?
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => console.log("hello world !!")}
                  >
                    Supprimer
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={columnDefs}
      apiData={GetCustomers}
      pageSize={20}
      className="w-full mx-auto"
    />
  );
}
