"use client";

import Autocomplete from "@components/molecules/autocomplete";
import InvoiceTemplate from "@components/templates/invoice-template";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoiceCreateData, InvoiceCreateValidation } from "@repo/shared-types";
import { useMemo, useReducer } from "react";
import { useForm } from "react-hook-form";
import { getAllCustomersQueryOptions } from "../../../../../lib/api/customers";
import { getAllTasksQueryOptions } from "../../../../../lib/api/tasks";

export default function CreateInvoicesPage() {
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useForm<InvoiceCreateData>({
    resolver: zodResolver(InvoiceCreateValidation),
    defaultValues: {
      title: "",
      number: "",
      tasks: [],
    },
  });

  const invoiceDoc = useMemo(() => {
    return (
      <InvoiceTemplate
        title={form.getValues().title}
        number={form.getValues().number}
      />
    );
  }, [update]);

  return (
    <div className="h-full">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Creation d'une facture</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <Input
              label={"common.title"}
              {...form.register("title", {
                onBlur: forceUpdate,
              })}
            />
            <Input
              label={"common.number"}
              type="number"
              {...form.register("number", { onBlur: forceUpdate })}
            />
            <Autocomplete
              label={"common.customer"}
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
              {...form.register("customerId", { onBlur: forceUpdate })}
            />
            <Autocomplete
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
              {...form.register("tasks", { onBlur: forceUpdate })}
            />
          </Form>
          <div>
            <p>Tasks</p>
          </div>
          <PDFDownloadLink document={invoiceDoc} fileName="invoice-1.pdf">
            {({ blob, url, loading, error }) => (
              <Button>
                {loading ? "Loading document..." : "Download now!"}
              </Button>
            )}
          </PDFDownloadLink>
        </CardContent>
      </Card>
      <PDFViewer className="w-full h-5/6 rounded-md" showToolbar={false}>
        {invoiceDoc}
      </PDFViewer>
    </div>
  );
}
