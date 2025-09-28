import Autocomplete from "@components/molecules/autocomplete";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { DateInput } from "@components/ui/date-input";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { SelectItemProps } from "@radix-ui/react-select";
import { InvoiceFilterData } from "@repo/shared-types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";
import { invoiceStatusToString } from "../../../lib/utils";

type InvoiceFilterProps = {
  className?: string;
  onChangeFilter: (filter: InvoiceFilterData | undefined) => void;
};

export default function InvoiceFilter({
  className,
  onChangeFilter,
}: InvoiceFilterProps) {
  const t = useTranslations();
  const form = useForm<InvoiceFilterData>({
    defaultValues: {
      number: "",
    },
  });
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const statusValues: SelectItemProps[] = [
    {
      value: "WAITING_VALIDATION",
      textValue: invoiceStatusToString("WAITING_VALIDATION"),
    },
    {
      value: "VALIDATE",
      textValue: invoiceStatusToString("VALIDATE"),
    },
    {
      value: "WAITING_PAYED",
      textValue: invoiceStatusToString("WAITING_PAYED"),
    },
    {
      value: "PAYED",
      textValue: invoiceStatusToString("PAYED"),
    },
  ];

  const invoiceTypes: SelectItemProps[] = [
    {
      value: "QUOTE",
      textValue: "Devis",
    },
    {
      value: "INVOICE",
      textValue: "Facture",
    },
  ];

  const onSubmit = (filter: InvoiceFilterData) => {
    onChangeFilter(filter);
  };

  const resetForm = () => {
    onChangeFilter(undefined);
    form.reset();
  };

  return (
    <Card className={clsx("pt-5 shadow-sm bg-slate-100/45", className)}>
      <CardContent className="">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <h4 className="font-semibold">{t("common.filters")}</h4>
            <div className="flex flex-row w-full gap-10">
              <Input
                type="text"
                label={t("common.number")}
                placeholder={t("invoice.search.number")}
                className="w-1/4"
                {...form.register("number")}
              />
              <Autocomplete
                label={t("common.customer")}
                placeholder={t("invoice.search.customer")}
                queryOptions={(filter) =>
                  getAllCustomersQueryOptions({
                    page: 0,
                    pageSize: 20,
                    asc: "name",
                    filter: {
                      name: filter.search,
                      id: filter.id,
                    },
                  })
                }
                render={(item) => item.name}
                filterField="name"
                fieldIdentifier="id"
                className="w-1/4"
                {...form.register("customerId")}
              />
              <Select
                label={t("common.status")}
                className="w-1/4"
                placeholder={t("invoice.search.status")}
                values={statusValues}
                {...form.register("status")}
              />
              <Select
                label={t("common.type")}
                className="w-1/4"
                placeholder={t("invoice.search.type")}
                values={invoiceTypes}
                {...form.register("type")}
              />
            </div>
            <div className="flex flex-row items-center gap-5 mt-4">
              <DateInput
                {...form.register("startDate")}
                className="w-1/6"
                placeholder={t("common.startDate")}
                label={t("common.startDate")}
                maxDate={endDate}
              />
              <span className="pt-5 text-sm">à</span>
              <DateInput
                {...form.register("endDate")}
                className="w-1/6"
                placeholder={t("common.endDate")}
                label={t("common.endDate")}
                minDate={startDate}
              />
            </div>
          </Form>
          <div className="mt-2 flex flex-row justify-end gap-5">
            <Button variant={"outline"} type="button" onClick={resetForm}>
              {t("common.reinit")}
            </Button>
            <Button type="submit">{t("common.apply")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
