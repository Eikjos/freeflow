"use client";

import { Button } from "@components/ui/button";
import { DateInput } from "@components/ui/date-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateObjectiveData,
  CreateObjectiveDataValidation,
} from "@repo/shared-types";
import { createObjective } from "actions/objective";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateObjectiveDialogProps = {
  className?: string;
};

export default function CreateObjectiveDialog({
  className,
}: CreateObjectiveDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<CreateObjectiveData>({
    resolver: zodResolver(CreateObjectiveDataValidation),
    defaultValues: {
      startDate: undefined,
      objectiveNumber: 0,
    },
  });

  const onSubmit = (values: CreateObjectiveData) => {
    createObjective(values)
      .then(() => {
        toast.success(t("objective.success.create"));
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form>
          <DialogTrigger asChild>
            <Button className={className}>
              {t("common.add")} <Plus size={25} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-3xl">
              {t("objective.title.create")}
            </DialogTitle>
            <div className="flex flex-row gap-3">
              <DateInput
                label={t("common.startDate")}
                placeholder={t("common.startDate")}
                maxDate={form.getValues().endDate}
                {...form.register("startDate")}
              />
              <DateInput
                {...form.register("endDate")}
                label={t("common.endDate")}
                minDate={form.getValues().startDate ?? new Date()}
                placeholder={t("common.endDate")}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("objective.start.description")}
            </p>
            <Select
              {...form.register("objectiveCategory")}
              label={t("common.category")}
              placeholder={t("common.category")}
              values={[
                { textValue: "Client", value: "CUSTOMER" },
                { textValue: "Chiffre d'affaire", value: "SALES" },
              ]}
            />
            <Input
              type="number"
              {...form.register("objectiveNumber")}
              label={t("objective.number")}
              placeholder={t("objective.number")}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} type="button">
                  {t("common.cancel")}
                </Button>
              </DialogClose>
              <Button
                onClick={form.handleSubmit(onSubmit, (err) => console.log(err))}
              >
                {t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
