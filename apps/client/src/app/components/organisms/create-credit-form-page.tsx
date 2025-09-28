"use client";

import CreateCreditForm from "@components/templates/create-credit-form";
import CreditTemplate from "@components/templates/credit-template";
import Loading from "@components/ui/loading";
import { Progress } from "@components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFViewer } from "@react-pdf/renderer";
import {
  CreateCreditData,
  CreateCreditDataValidation,
  CreateCreditLineData,
  InvoiceData,
} from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useEnterprise } from "providers/enterprise-provider";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { getInformationForDevisQueryOptions } from "../../../lib/api/enterprise";
import { formatPrice } from "../../../lib/utils";

type CreateCreditFormProps = {
  invoice: InvoiceData;
};

export default function CreateCreditFormPage({
  invoice,
}: CreateCreditFormProps) {
  const { enterprise } = useEnterprise();
  const initialCreditAmount = invoice.credits
    .map((c) => c.totalAmount)
    .reduce((i, prev) => prev + i, 0);
  const totalAmount =
    invoice.invoiceLines
      .map((e) => e.unitPrice * e.quantity)
      .reduce((i, prev) => prev + i) * (invoice.excludeTva ? 1 : 1.2);
  const [creditsTotalAmount, setCreditTotalAmount] =
    useState(initialCreditAmount);
  const [ratio, setRatio] = useState<number>(
    (creditsTotalAmount / totalAmount) * 100
  );
  const form = useForm<
    CreateCreditData & { newLine: CreateCreditLineData; maskName: boolean }
  >({
    resolver: zodResolver(CreateCreditDataValidation),
    defaultValues: {
      title: "",
      number: "",
      creditLines: [],
      invoiceId: invoice.id,
      newLine: { title: "", price: 0 },
      maskName: true,
    },
  });
  const { data, isLoading } = useQuery({
    ...getInformationForDevisQueryOptions(enterprise?.id!),
    enabled: enterprise?.id !== undefined,
  });
  const creditLines = useWatch({ control: form.control, name: "creditLines" });

  useEffect(() => {
    const totalCreditsAmount =
      initialCreditAmount +
      creditLines
        ?.map((e) => parseFloat(!e.price ? "0" : e.price.toString()))
        .reduce((e, prev) => e + prev, 0);
    setRatio((totalCreditsAmount / totalAmount) * 100);
    setCreditTotalAmount(totalCreditsAmount);
  }, [creditLines]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...form}>
        <div className="mb-5">
          <div className="mb-1 flex flex-col items-end">
            <span
              style={{
                marginRight: `${ratio === 0 ? 97 : 97 - ratio < 0 ? 0 : 97 - ratio}%`,
              }}
            >
              {formatPrice(creditsTotalAmount, "FR-fr", "EUR")}
            </span>
          </div>
          <Progress value={ratio > 100 ? 100 : ratio} />
        </div>
        <CreateCreditForm
          invoice={invoice}
          information={data?.data}
          totalAmountInvoice={totalAmount}
          totalCreditInvoice={initialCreditAmount}
        />
        <PDFViewer
          showToolbar={false}
          className="w-full h-full rounded-md mt-4"
        >
          <CreditTemplate
            title={form.getValues().title}
            invoice={invoice}
            customer={invoice.customer}
            number={form.getValues().number}
            information={data?.data}
            maskName={form.getValues().maskName}
            excludeTva={invoice.excludeTva}
            lines={form.getValues().creditLines}
          />
        </PDFViewer>
      </FormProvider>
    </>
  );
}
