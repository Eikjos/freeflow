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
import { ObjectiveData } from "@repo/shared-types";
import { ColumnDef } from "@tanstack/react-table";
import { deleteObjective } from "actions/objective";
import dayjs from "dayjs";
import { PenBox, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import CreateObjectiveDialog from "./create-objective-dialog";

type ObjectiveTableProps = {
  data: ObjectiveData[];
  isLoading: boolean;
  onDelete: () => void;
  onUpdate: () => void;
};

export default function ObjectiveTable({
  data,
  isLoading,
  onDelete,
  onUpdate,
}: ObjectiveTableProps) {
  const t = useTranslations();
  const columnDefs: ColumnDef<ObjectiveData>[] = [
    {
      accessorKey: "startDate",
      header: t("common.startDate"),
      cell: ({ row }) => (
        <span>{dayjs(row.original.startDate).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      accessorKey: "endDate",
      header: t("common.endDate"),
      cell: ({ row }) => (
        <span>{dayjs(row.original.endDate).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      accessorKey: "category",
      header: t("common.category"),
      cell: ({ row }) => (
        <span>
          {row.original.objectiveCategory === "CUSTOMER"
            ? t("common.customer")
            : t("common.sales")}
        </span>
      ),
    },
    {
      accessorKey: "level",
      header: t("common.level"),
      cell: ({ row }) => (
        <span>
          {row.original.currentNumber} / {row.original.objectiveNumber}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("common.status"),
      cell: ({ row }) => {
        if (row.original.currentNumber >= row.original.objectiveNumber) {
          return <span className="text-green-500">{t("common.sucess")}</span>;
        } else if (row.original.endDate <= new Date()) {
          return <span className="text-red-500">{t("common.failed")}</span>;
        } else if (row.original.startDate > new Date()) {
          return <span className="text-muted">{t("objective.noStart")}</span>;
        } else {
          return <span>{t("objective.inProgress")}</span>;
        }
      },
    },
    {
      accessorKey: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-4">
          <CreateObjectiveDialog
            trigger={<PenBox size={18} />}
            defaultValue={row.original}
            isUpdate
            callback={onUpdate}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Trash color="red" size={18} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl">
                  {t("objective.delete.title")}
                </DialogTitle>
              </DialogHeader>
              <p>{t("objective.delete.description")}</p>
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

  const handleDelete = (id: number) => {
    deleteObjective(id)
      .then(() => {
        toast.success(t("objective.success.delete"));
        onDelete();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <DataTable columns={columnDefs} data={data ?? []} isLoading={isLoading} />
  );
}
