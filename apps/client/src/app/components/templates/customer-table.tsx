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
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteCutomer } from "actions/customer";
import { PenBoxIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";
import getQueryClient from "../../../lib/query-client";

export default function CustomerTable() {
  const t = useTranslations();
  const queryClient = getQueryClient();
  const [page, setPage] = useState<PaginationType>({ page: 0, pageSize: 2 });
  const { data: customers, refetch } = useQuery(
    getAllCustomersQueryOptions(page)
  );

  const handleChangePage = (page: number) => {
    setPage((prev) => ({ ...prev, page }));
  };

  const OnDeleteCustomer = (customer: CustomerModel) => {
    DeleteCutomer(customer.id).then((res) => {
      if (res.ok) {
        toast.success("Suppression du client " + customer.id);
        if ((customers?.data?.data.length ?? 0) > 1 && page.page > 0) {
          queryClient.invalidateQueries({
            queryKey: ["customers", page],
          });
          refetch();
        } else {
          setPage((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      } else {
        toast.error(`Erreur suppression du client : ${customer.name}`);
      }
    });
  };

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
                <DialogTitle className="text-3xl">
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
                    onClick={() => OnDeleteCustomer(row.original)}
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
    <>
      <DataTable
        columns={columnDefs}
        data={customers?.data?.data ?? []}
        pageSize={20}
        className="w-full mx-auto"
      />
      {customers?.data?.totalItems && customers?.data?.totalItems > 0 && (
        <Pagination
          totalItems={customers?.data?.totalItems ?? 0}
          pageSize={customers?.data?.pageSize ?? 0}
          page={customers?.data?.page ?? 0}
          className="mt-10"
          onChangePage={handleChangePage}
        />
      )}
    </>
  );
}
