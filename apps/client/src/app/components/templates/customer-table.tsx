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
import { Pagination } from "@components/ui/pagination";
import {
  CustomerModel,
  Pagination as PaginationType,
} from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { PenBoxIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";
import { useQuery } from "@tanstack/react-query";

export default function CustomerTable() {
  const t = useTranslations();
  const [page, setPage] = useState<PaginationType>({ page: 0, pageSize: 20 });
  const query = useQuery(getAllCustomersQueryOptions(page));
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

  const handleChangePage = (page: number) => {
    setPage((prev) => ({ ...prev, page }));
  };

  return (
    <>
      <DataTable
        columns={columnDefs}
        data={query.data?.data ?? []}
        pageSize={20}
        className="w-full mx-auto"
      />
      <Pagination
        totalItems={query.data?.totalItems ?? 0}
        pageSize={query.data?.pageSize ?? 0}
        page={query.data?.page ?? 0}
        className="mt-10"
        onChangePage={handleChangePage}
      />
    </>
  );
}
