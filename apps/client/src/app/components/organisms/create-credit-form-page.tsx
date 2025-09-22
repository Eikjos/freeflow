"use client";

import CreateCreditForm from "@components/templates/create-credit-form";
import { Progress } from "@components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCreditData,
  CreateCreditDataValidation,
  CreateCreditLineData,
  InvoiceData,
} from "@repo/shared-types";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { formatPrice } from "../../../lib/utils";

type CreateCreditFormProps = {
  invoice: InvoiceData;
};

export default function CreateCreditFormPage({
  invoice,
}: CreateCreditFormProps) {
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
  const form = useForm<CreateCreditData & { newLine: CreateCreditLineData }>({
    resolver: zodResolver(CreateCreditDataValidation),
    defaultValues: {
      title: "",
      number: "",
      creditLines: [],
      invoiceId: invoice.id,
      newLine: { title: "", price: 0 },
    },
  });
  const creditLines = useWatch({ control: form.control, name: "creditLines" });

  useEffect(() => {
    const totalCreditsAmount =
      initialCreditAmount +
      creditLines
        ?.map((e) => parseFloat(!e.price ? 0 : e.price.toString()))
        .reduce((e, prev) => e + prev, 0);
    setRatio((totalCreditsAmount / totalAmount) * 100);
    setCreditTotalAmount(totalCreditsAmount);
  }, [creditLines]);

  return (
    <FormProvider {...form}>
      <div className="mb-5">
        <div className="mb-1">
          <span
            style={{
              marginLeft: `${ratio === 0 ? ratio : ratio > 93 ? 93 : ratio - 1}%`,
            }}
          >
            {formatPrice(creditsTotalAmount, "FR-fr", "EUR")}
          </span>
        </div>
        <Progress value={ratio > 100 ? 100 : ratio} />
      </div>
      <CreateCreditForm
        totalAmountInvoice={totalAmount}
        totalCreditInvoice={initialCreditAmount}
      />
      {/* <PDFViewer showToolbar={false}></PDFViewer> */}
    </FormProvider>
  );
}
