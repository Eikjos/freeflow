import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { pdf } from "@react-pdf/renderer";
import {
  CreateCreditData,
  CreateCreditLineData,
  CreateCreditLineDataValidation,
  InvoiceData,
  InvoiceInformation,
} from "@repo/shared-types";
import { createCredit } from "actions/credit";
import { Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { formatPrice } from "../../../lib/utils";
import CreditTemplate from "./credit-template";

type CreateCreditFormProps = {
  invoice: InvoiceData;
  information: InvoiceInformation | undefined;
  totalAmountInvoice: number;
  totalCreditInvoice: number;
};

export default function CreateCreditForm({
  invoice,
  information,
  totalAmountInvoice = 0,
  totalCreditInvoice = 0,
}: CreateCreditFormProps) {
  const t = useTranslations();
  const form = useFormContext<
    CreateCreditData & { newLine: CreateCreditLineData; maskName: boolean }
  >();
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "creditLines",
  });

  const addLine = () => {
    const { newLine } = form.getValues();
    form.clearErrors("newLine.price");
    form.clearErrors("newLine.title");
    const result = CreateCreditLineDataValidation.safeParse(newLine);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        return form.setError(
          err.path[0] === "price" ? "newLine.price" : "newLine.title",
          { message: err.message }
        );
      });
      return;
    }

    // checking that not exceed the amount of invoice
    const previousTotal =
      totalCreditInvoice +
      fields
        .map((e) => parseFloat(e.price.toString()))
        .reduce((e, prev) => e + prev, 0);

    const totalCredits = parseFloat(newLine.price.toString()) + previousTotal;

    if (totalAmountInvoice < totalCredits) {
      form.setError("newLine.price", {
        message: t("credit.notExceedAmount", {
          amount: formatPrice(
            totalAmountInvoice - totalCreditInvoice,
            "FR-fr",
            "EUR"
          ),
        }),
      });

      return;
    }

    append(result.data);
    form.setValue("newLine.title", "");
    form.setValue("newLine.price", 0);
  };

  const handleMaskNameChange = () => {
    form.setValue("maskName", !form.watch("maskName"));
  };

  const onSubmit = async (values: CreateCreditData) => {
    // checking if the credit amount not exceed the invoice amount
    var totalCreditAmount = values.creditLines
      .map((cl) => cl.price)
      .reduce((i, prev) => prev + i, 0);
    if (totalCreditAmount > totalAmountInvoice - totalCreditInvoice) {
      toast.error(
        t("credit.exceedAmountInvoice", {
          amount: formatPrice(
            totalAmountInvoice - totalCreditInvoice,
            "FR-fr",
            "EUR"
          ),
        })
      );
      return;
    }
    const creditBlob = await pdf(
      <CreditTemplate
        title={values.title}
        number={values.number}
        invoice={invoice}
        excludeTva={invoice.excludeTva}
        information={information}
        maskName={form.getValues().maskName}
        lines={values.creditLines}
      />
    ).toBlob();
    createCredit(
      {
        ...values,
        number: `AV-${String(values.number).padStart(5, "0")}`,
        invoiceId: form.getValues().invoiceId,
      },
      new File([creditBlob], `credit-AV-${values.number}.pdf`)
    )
      .then((res) => {
        toast.success(t("credit.success.create"));
        router.push("/invoices");
      })
      .catch((err: Error) => {
        toast.error(err.message);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="py-2 px-4">
            <div className="flex flex-row justify-end mt-2">
              <Checkbox
                label={t("invoice.maskName")}
                checked={form.getValues().maskName}
                onCheckedChange={handleMaskNameChange}
              />
            </div>

            <Input label={t("common.number")} {...form.register("number")} />
            <Input label={t("common.title")} {...form.register("title")} />
            <div className="mt-5 pt-5 border-t border-secondary">
              <span>{t("credit.lines.add")}</span>
              <div className="flex flex-row w-full items-start gap-2">
                <div className="flex flex-row items-start gap-2 w-full">
                  <Input
                    label={t("common.name")}
                    className="w-3/5"
                    error={form.formState.errors.newLine?.title?.message}
                    {...form.register(`newLine.title`)}
                  />
                  <Input
                    label={t("common.priceTTC")}
                    className="w-2/5"
                    type="number"
                    step="0.5"
                    error={form.formState.errors.newLine?.price?.message}
                    description={t("credit.warning.amount")}
                    {...form.register(`newLine.price`)}
                  />
                </div>
                <Button type="button" onClick={addLine} className="mt-6">
                  <Plus />
                </Button>
              </div>
            </div>

            {fields && fields.length > 0 && (
              <>
                <Separator
                  orientation="horizontal"
                  className="bg-secondary my-5"
                />
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-row w-full gap-2 items-end"
                    >
                      <Input
                        className="w-3/4"
                        {...form.register(`creditLines.${index}.title`)}
                      />
                      <Input
                        className="w-1/4"
                        type="number"
                        step="0.5"
                        {...form.register(`creditLines.${index}.price`)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <CardFooter className="flex flex-row justify-end mt-5 p-0">
              <Button type="submit" disabled={!form.formState.isValid}>
                {t("common.create")}
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
