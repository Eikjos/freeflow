import Autocomplete from "@components/molecules/autocomplete";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { DateInput } from "@components/ui/date-input";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { InvoiceFilterData } from "@repo/shared-types";
import clsx from "clsx";
import { useEnterprise } from "providers/enterprise-provider";
import { useForm } from "react-hook-form";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";

type InvoiceFilterProps = {
  className?: string;
  // filter: InvoiceFilterData;
  // onChangeFilter: (filter : InvoiceFilterData) => void;
};

export default function InvoiceFilter({
  className,
  // filter,
  // onChangeFilter
}: InvoiceFilterProps) {
  const { enterprise } = useEnterprise();
  const form = useForm<InvoiceFilterData>({
    defaultValues: {
      number: "",
    },
  });

  return (
    <Card className={clsx("pt-5 shadow-sm bg-slate-100/45", className)}>
      <CardContent className="">
        <form>
          <Form {...form}>
            <h4 className="font-semibold">Filtres</h4>
            <div className="flex flex-row w-full gap-10">
              <Input
                type="text"
                label="Numéro"
                className="w-1/3"
                {...form.register("number")}
              />
              <Autocomplete
                label={"common.customer"}
                placeholder="Sélectionner un client"
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
                className="w-1/3"
                {...form.register("customerId")}
              />
              <Select
                label="Status"
                className="w-1/3"
                values={[]}
                {...form.register("customerId")}
              />
            </div>
            <div className="flex flex-row items-center gap-5 mt-4">
              <DateInput
                {...form.register("startDate")}
                className="w-1/4"
                label="Date de début"
              />
              <span className="pt-5 text-sm">à</span>
              <DateInput
                {...form.register("endDate")}
                className="w-1/4"
                label="Date de fin"
              />
            </div>
          </Form>
          <div className="mt-2 flex flex-row justify-end gap-5">
            <Button variant={"outline"} type="button">
              Réinitialiser
            </Button>
            <Button type="submit">Appliquer</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
