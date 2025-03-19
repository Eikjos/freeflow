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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";
import getQueryClient from "../../../lib/query-client";

export default function CustomerTable() {
  const t = useTranslations();
  const queryClient = getQueryClient();
  const [page, setPage] = useState<PaginationType>({ page: 0, pageSize: 10 });
  const {
    data: customers,
    refetch,
    isLoading,
  } = useQuery(getAllCustomersQueryOptions(page));

  const handleChangePage = (page: number) => {
    setPage((prev) => ({ ...prev, page }));
  };

  const OnDeleteCustomer = (customer: CustomerModel) => {
    DeleteCutomer(customer.id).then((res) => {
      if (res.ok) {
        toast.success(t("customer.removeSuccess", { customer: customer.name }));
        // si il y a encore un client après suppression
        if ((customers?.data?.data.length ?? 0) > 1 || page.page === 0) {
          queryClient.invalidateQueries({
            queryKey: ["customers", page],
          });
          refetch();
          // sinon aller sur la page précédente si elle permet
        } else {
          setPage((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      } else {
        toast.error(t("customer.removeFailed", { customer: customer.name }));
      }
    });
  };

  const columnDefs: ColumnDef<CustomerModel>[] = [
    {
      accessorKey: "name",
      header: t("common.name"),
    },
    {
      accessorFn: (row) => row.siret ?? "Pas renseigné",
      header: t("common.siret"),
    },
    {
      accessorFn: (row) => `${row.city}, ${t(row.country)}`,
      header: t("common.localisation"),
    },
    {
      accessorKey: "email",
      header: t("common.email"),
    },
    {
      accessorKey: "phone",
      header: t("common.phone"),
    },
    {
      header: t("common.actions"),
      cell: ({ row }) => (
        <div className="flex flew-row gap-4">
          <Link href={`/customers/${row.original.id}/edit`}>
            <PenBoxIcon size={18} />
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Trash color="red" size={18} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl">
                  {t("customer.dialog.removeTitle", {
                    customer: row.getValue("name"),
                  })}
                </DialogTitle>
              </DialogHeader>
              <p>
                {t("customer.dialog.removeDescription", {
                  customer: row.getValue("name"),
                })}
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>{t("common.cancel")}</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => OnDeleteCustomer(row.original)}
                  >
                    {t("common.remove")}
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
        isLoading={isLoading}
        className="w-full mx-auto"
      />
      {(customers?.data?.totalItems ?? 0) > 0 && (
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
