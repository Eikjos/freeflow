import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import {
  CreateCreditData,
  CreateCreditLineData,
  CreateCreditLineDataValidation,
} from "@repo/shared-types";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { formatPrice } from "../../../lib/utils";

type CreateCreditFormProps = {
  totalAmountInvoice: number;
  totalCreditInvoice: number;
};

export default function CreateCreditForm({
  totalAmountInvoice = 0,
  totalCreditInvoice = 0,
}: CreateCreditFormProps) {
  const form = useFormContext<
    CreateCreditData & { newLine: CreateCreditLineData; maskName: boolean }
  >();
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
      if (totalAmountInvoice - previousTotal > 0) {
        form.setError("newLine.price", {
          message: `Le prix ne doit pas excéder ${formatPrice(totalAmountInvoice - previousTotal, "FR-fr", "EUR")}.`,
        });
      } else {
        form.setError("newLine.price", {
          message: `Le prix de l'avoir ne doit pas excéder ${formatPrice(totalAmountInvoice - totalCreditInvoice, "FR-fr", "EUR")}.`,
        });
      }

      return;
    }

    append(result.data);
    form.setValue("newLine.title", "");
    form.setValue("newLine.price", 0);
  };

  const handleMaskNameChange = () => {
    form.setValue("maskName", !form.watch("maskName"));
  };

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardContent className="py-2 px-4">
            <div className="flex flex-row justify-end mt-2">
              <Checkbox
                label="Masquer le nom"
                checked={form.getValues().maskName}
                onCheckedChange={handleMaskNameChange}
              />
            </div>

            <Input label="common.number" {...form.register("number")} />
            <Input label="common.title" {...form.register("title")} />
            <div className="mt-5 pt-5 border-t border-secondary">
              <span>Ajouter une nouvelle ligne</span>
              <div className="flex flex-row w-full items-start gap-2">
                <div className="flex flex-row items-start gap-2 w-full">
                  <Input
                    label="common.name"
                    className="w-3/5"
                    error={form.formState.errors.newLine?.title?.message}
                    {...form.register(`newLine.title`)}
                  />
                  <Input
                    label="price TTC"
                    className="w-2/5"
                    type="number"
                    step="0.5"
                    error={form.formState.errors.newLine?.price?.message}
                    description="Attention l'avoir ne peut pas dépasser le montant de la facture."
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
                Créer
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
