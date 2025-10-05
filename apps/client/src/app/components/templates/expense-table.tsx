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
import { ExpenseData } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice } from "../../../lib/utils";

type ExpenseTableProps = {
  data: ExpenseData[];
  isLoading: boolean;
  className?: string;
  handleDelete: (id: number) => void;
};

export default function ExpenseTable({
  className,
  data,
  isLoading,
  handleDelete,
}: ExpenseTableProps) {
  const t = useTranslations();

  const columnDefs: ColumnDef<ExpenseData>[] = [
    {
      accessorKey: "name",
      header: t("common.name"),
      meta: {
        className: "w-[500px] max-w-[700px] min-w-[200px]",
      },
    },
    {
      header: t("common.category"),
      accessorFn: (row) => t(row.category.key),
    },
    {
      accessorKey: "amount",
      header: t("common.amount"),
      cell: ({ row }) => (
        <span>{formatPrice(row.original.amount, "FR-fr", "EUR")}</span>
      ),
    },
    {
      header: t("expense.amountTvaRecoverable"),
      cell: ({ row }) => {
        const amountTva =
          row.original.amount * (row.original.category.tva / 100);
        return (
          <span>
            {formatPrice(
              amountTva * (row.original.category.recoverablePercent / 100),
              "Fr-fr",
              "EUR"
            )}
          </span>
        );
      },
    },
    {
      header: t("expense.costReal"),
      cell: ({ row }) => {
        const amountTva =
          row.original.amount * (row.original.category.tva / 100);
        return (
          <span>
            {formatPrice(
              row.original.amount -
                amountTva * (row.original.category.recoverablePercent / 100),
              "Fr-fr",
              "EUR"
            )}
          </span>
        );
      },
    },
    {
      header: t("common.actions"),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Trash color="red" size={18} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl">
                  {t("expense.delete.title")}
                </DialogTitle>
              </DialogHeader>
              <p>{t("expense.delete.description")}</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>{t("common.cancel")}</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(row.original.id)}
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
    <DataTable
      columns={columnDefs}
      data={data}
      isLoading={isLoading}
      className={className}
    />
  );
}
