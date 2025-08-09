"use client";

import Autocomplete from "@components/molecules/autocomplete";
import CreateInvoiceLineModal from "@components/organisms/create-invoice-line-dialog";
import InvoiceLineList from "@components/organisms/invoice-line-list";
import InvoiceTemplate from "@components/templates/invoice-template";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { DateInput } from "@components/ui/date-input";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import {
  InvoiceCreateData,
  InvoiceCreateValidation,
  InvoiceLineData,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useEnterprise } from "providers/enterprise-provider";
import { useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllCustomersQueryOptions } from "../../../../../lib/api/customers";
import { getInformationForInvoiceQueryOptions } from "../../../../../lib/api/enterprise";
import {
  getAllTasksQueryOptions,
  getTasksById,
} from "../../../../../lib/api/tasks";

export default function CreateInvoicesPage() {
  const { enterprise } = useEnterprise();
  const [maskNameOnInvoice, setMaskNameOnInvoice] = useState<boolean>(true);
  const [excludeTva, setExcludeTva] = useState<boolean>(false);
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const [autocompleteKey, setAutocompleteKey] = useReducer((x) => x + 1, 0);
  const [modalTaskOpen, setModalTaskOpen] = useState<boolean>(false);
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineData[]>([]);
  const invoiceInformation = useQuery({
    ...getInformationForInvoiceQueryOptions(enterprise?.id!),
    enabled: enterprise?.id !== undefined,
  });
  const form = useForm<InvoiceCreateData>({
    resolver: zodResolver(InvoiceCreateValidation),
    defaultValues: {
      title: "",
      number: (invoiceInformation.data?.ok
        ? (invoiceInformation?.data?.data?.lastNumber ?? 0)
        : 0
      ).toString(),
      date: new Date(),
      InvoiceLine: [],
    },
  });

  const invoiceDoc = useMemo(() => {
    return (
      <InvoiceTemplate
        title={form.getValues().title}
        number={form.getValues().number}
        date={form.getValues().date}
        customerId={form.getValues().customerId}
        information={invoiceInformation.data?.data}
        maskName={maskNameOnInvoice}
        excludeTva={excludeTva}
        lines={invoiceLines}
      />
    );
  }, [update, invoiceInformation.data]);

  const appendInvoiceLine = (value: InvoiceLineData) => {
    setInvoiceLines((prev) => [...prev, value]);
    forceUpdate();
  };

  const handleChangeInvoiceLine = (values: InvoiceLineData[]) => {
    setInvoiceLines(values);
    forceUpdate();
  };

  const handleChangeTask = async (value: number) => {
    const invoiceLine = await getTasksById(value);
    if (
      invoiceLine.ok &&
      !invoiceLines.some((e) => e.name === invoiceLine.data?.name)
    ) {
      setInvoiceLines((prev) => [
        ...prev,
        {
          name: invoiceLine.data?.name,
          quantity: 1,
          unitPrice: 0.0,
        } as InvoiceLineData,
      ]);
    }
    setAutocompleteKey();
  };

  const handleMashNameChange = (checked: CheckedState) => {
    setMaskNameOnInvoice(checked ? true : false);
    forceUpdate();
  };

  const handleExcludeTvaChange = (checked: CheckedState) => {
    setExcludeTva(checked ? true : false);
    forceUpdate();
  };

  return (
    <div className="h-full">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Creation d'une facture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-rox justify-end gap-4">
            <Checkbox
              label="Masquer le nom"
              checked={maskNameOnInvoice}
              onCheckedChange={handleMashNameChange}
            />
            <Checkbox
              label="Ne pas inclure la TVA"
              checked={excludeTva}
              onCheckedChange={handleExcludeTvaChange}
            />
          </div>
          <Form {...form}>
            <Input
              label={"common.title"}
              placeholder="Titre de la facture"
              {...form.register("title", {
                onBlur: forceUpdate,
              })}
            />
            <Input
              label={"common.number"}
              type="number"
              placeholder="Numéro de la facture"
              {...form.register("number", { onBlur: forceUpdate })}
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
                    customerId: form.getValues().customerId,
                  },
                })
              }
              disabled={!form.getValues().customerId}
              filterField="name"
              render={(task) => `${task.name}`}
              fieldIdentifier="id"
              label="Tâches"
              className="mt-3"
              placeholder="Sélectionner une tâche"
              onAdd={() => setModalTaskOpen(true)}
              addLabel={"Ajouter une tâche"}
              {...form.register("InvoiceLine", {
                onBlur: forceUpdate,
                value: [],
                onChange: (event) => handleChangeTask(event.target.value),
              })}
            />
          </Form>
          {invoiceLines.length > 0 && (
            <div className="mt-4">
              <p>Les lignes de facturation</p>
              <InvoiceLineList
                invoices={invoiceLines}
                handleChange={handleChangeInvoiceLine}
              />
            </div>
          )}
          <PDFDownloadLink document={invoiceDoc} fileName="invoice-1.pdf">
            {({ blob, url, loading, error }) => (
              <Button className="mt-4">
                {loading ? "Loading document..." : "Download now!"}
              </Button>
            )}
          </PDFDownloadLink>
        </CardContent>
      </Card>
      <CreateInvoiceLineModal
        open={modalTaskOpen}
        handleOpen={(value) => setModalTaskOpen(value)}
        handleSubmit={(value) => appendInvoiceLine(value)}
      />
      <PDFViewer className="w-full h-5/6 rounded-md" showToolbar={false}>
        {invoiceDoc}
      </PDFViewer>
    </div>
  );
}
