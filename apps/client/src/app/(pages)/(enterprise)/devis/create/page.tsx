"use client";

import Autocomplete from "@components/molecules/autocomplete";
import CreateInvoiceLineModal from "@components/organisms/create-invoice-line-dialog";
import InvoiceLineList from "@components/organisms/invoice-line-list";
import DevisTemplate from "@components/templates/devis-template";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { DateInput } from "@components/ui/date-input";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import Loading from "@components/ui/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import {
  InvoiceCreateData,
  InvoiceCreateValidation,
  InvoiceLineCreateData,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { createInvoice } from "actions/invoice";
import { useRouter } from "next/navigation";
import { useEnterprise } from "providers/enterprise-provider";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getAllCustomersQueryOptions,
  getCustomerByIdOptions,
} from "../../../../../lib/api/customers";
import { getInformationForDevisQueryOptions } from "../../../../../lib/api/enterprise";
import {
  getAllTasksQueryOptions,
  getTasksById,
} from "../../../../../lib/api/tasks";

export default function CreateDevisPage() {
  const { enterprise } = useEnterprise();
  const router = useRouter();
  const [maskNameOnInvoice, setMaskNameOnInvoice] = useState<boolean>(true);
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const [autocompleteKey, setAutocompleteKey] = useReducer((x) => x + 1, 0);
  const [modalTaskOpen, setModalTaskOpen] = useState<boolean>(false);
  const { data, isSuccess, isLoading } = useQuery({
    ...getInformationForDevisQueryOptions(enterprise?.id!),
    enabled: enterprise?.id !== undefined,
  });
  const form = useForm<InvoiceCreateData>({
    resolver: zodResolver(InvoiceCreateValidation),
    defaultValues: {
      title: "",
      number: "1",
      customerId: undefined,
      date: new Date(),
      type: "QUOTE",
      invoiceLines: [],
      excludeTva: false,
    },
  });
  const customerId = form.watch("customerId");
  const customer = useQuery({
    ...getCustomerByIdOptions(customerId ? customerId.toString() : ""),
    enabled: customerId !== undefined,
  });

  useEffect(() => {
    if (data?.data?.lastNumber !== undefined && isSuccess) {
      form.setValue("number", (data.data.lastNumber ?? 1).toString());
    }
    forceUpdate();
  }, [data?.data]);

  const appendInvoiceLine = (value: InvoiceLineCreateData) => {
    const invoiceLinesOld = form.getValues().invoiceLines;
    form.setValue("invoiceLines", [...invoiceLinesOld, value]);
    forceUpdate();
  };

  const handleChangeInvoiceLine = (values: InvoiceLineCreateData[]) => {
    form.setValue("invoiceLines", values);
    forceUpdate();
  };

  const handleChangeTask = async (value: number | undefined) => {
    if (value !== undefined) {
      const invoiceLine = await getTasksById(value);
      const invoiceLinesOld = form.getValues().invoiceLines;
      if (
        invoiceLine.ok &&
        !invoiceLinesOld.some((e) => e.name === invoiceLine.data?.name)
      ) {
        form.setValue("invoiceLines", [
          ...invoiceLinesOld,
          { name: invoiceLine.data?.name!, quantity: 1, unitPrice: 0.0 },
        ]);
      }
      setAutocompleteKey();
    }
  };

  const handleMashNameChange = (checked: CheckedState) => {
    setMaskNameOnInvoice(checked ? true : false);
    forceUpdate();
  };

  const handleExcludeTvaChange = (checked: CheckedState) => {
    form.setValue("excludeTva", checked ? true : false);
    forceUpdate();
  };

  const onSubmit = async (values: InvoiceCreateData) => {
    const invoiceBlob = await pdf(
      <DevisTemplate
        title={values.title}
        number={values.number}
        date={values.date}
        customer={customer.data?.data}
        information={data?.data}
        maskName={maskNameOnInvoice}
        excludeTva={values.excludeTva}
        lines={values.invoiceLines}
      />
    ).toBlob();

    createInvoice(
      {
        ...values,
        type: "QUOTE",
        excludeTva: values.excludeTva ?? false,
        number: `DEV-${String(values.number).padStart(5, "0")}`,
      },
      new File([invoiceBlob], `devis-${values.number}.pdf`)
    )
      .then((res) => {
        if (res === null) {
          toast.error("Il y a eu une erreur.");
        } else {
          toast.success("Le devis a bien été créé.");

          router.push("/invoices");
        }
      })
      .catch((err: Error) => {
        toast.error(err.message);
      });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex-row flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Création d'un devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-rox justify-end gap-4">
            <Checkbox
              label="Masquer le nom"
              checked={maskNameOnInvoice}
              onCheckedChange={handleMashNameChange}
            />
            {data?.data?.enterprise.juridicShape ===
              "Entrepreneur individuel" && (
              <Checkbox
                label="Ne pas inclure la TVA"
                checked={form.getValues().excludeTva}
                onCheckedChange={handleExcludeTvaChange}
              />
            )}
          </div>
          <Form {...form}>
            <form>
              <Input
                label={"common.title"}
                placeholder="Titre de la facture"
                {...form.register("title", {
                  onBlur: forceUpdate,
                })}
              />
              <DateInput
                label={"common.number"}
                {...form.register("date", { onBlur: forceUpdate })}
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
                {...form.register("customerId", { onChange: forceUpdate })}
              />
              <Autocomplete
                key={autocompleteKey}
                queryOptions={(filter) =>
                  getAllTasksQueryOptions({
                    page: 0,
                    pageSize: 20,
                    asc: "name",
                    filter: {
                      name: filter.search,
                      id: filter.id,
                      customerId: customerId,
                    },
                  })
                }
                disabled={!customerId}
                filterField="name"
                render={(task) => `${task.name}`}
                fieldIdentifier="id"
                label="Tâches"
                className="mt-3"
                placeholder="Sélectionner une tâche"
                onAdd={() => setModalTaskOpen(true)}
                addLabel={"Ajouter une tâche"}
                {...form.register("invoiceLines", {
                  onBlur: forceUpdate,
                  value: undefined,
                  onChange: (event) => handleChangeTask(event.target.value),
                })}
              />
            </form>
          </Form>
          {form.getValues().invoiceLines.length > 0 && (
            <div className="mt-4">
              <p>Les lignes de facturation</p>
              <InvoiceLineList
                invoices={form.getValues().invoiceLines}
                handleChange={handleChangeInvoiceLine}
              />
            </div>
          )}
          <div className="flex flex-row justify-end mt-4">
            <Button onClick={form.handleSubmit(onSubmit)}>
              Enregistrer et envoyer
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreateInvoiceLineModal
        open={modalTaskOpen}
        handleOpen={(value) => setModalTaskOpen(value)}
        handleSubmit={(value) => appendInvoiceLine(value)}
      />
      <PDFViewer
        className="w-full h-5/6 rounded-md"
        showToolbar={false}
        key={update}
      >
        <DevisTemplate
          title={form.getValues().title}
          number={form.getValues().number}
          date={form.getValues().date}
          customer={customer?.data?.data}
          information={data?.data}
          maskName={maskNameOnInvoice}
          excludeTva={form.getValues().excludeTva}
          lines={form.getValues().invoiceLines}
        />
      </PDFViewer>
    </div>
  );
}
