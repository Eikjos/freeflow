import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceLineData, InvoiceLineValidation } from "@repo/shared-types";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

type InvoiceLineProps = {
  invoice: InvoiceLineData;
  onChange: (value: InvoiceLineData) => void;
  onDelete: (value: InvoiceLineData) => void;
};

export default function InvoiceLine({
  invoice,
  onChange,
  onDelete,
}: InvoiceLineProps) {
  const form = useForm<InvoiceLineData>({
    resolver: zodResolver(InvoiceLineValidation),
    defaultValues: {
      name: invoice.name,
      quantity: invoice.quantity,
      unitPrice: invoice.unitPrice,
    },
  });
  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");

  const handleChangeTotal = (value: number) => {
    if (!isNaN(value)) {
      form.setValue("quantity", 1);
      form.setValue("unitPrice", value);
      onChange(form.getValues());
    }
  };

  const handleBlur = () => {
    onChange(form.getValues());
  };

  return (
    <div className="w-full flex flex-row gap-4 items-center justify-between">
      <span className="w-2/3 text-sm">{invoice.name}</span>
      <Form {...form}>
        <form>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm">Quantité</span>
              <Input
                type="number"
                {...form.register("quantity", { onBlur: handleBlur })}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm">Prix Unit</span>
              <Input
                type="number"
                step="0.5"
                {...form.register("unitPrice", { onBlur: handleBlur })}
              />
              <span>€</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm">Total HT</span>
              <Input
                type="number"
                step="0.5"
                value={quantity * unitPrice}
                onChange={(event) =>
                  handleChangeTotal(event.currentTarget.valueAsNumber)
                }
              />
              <span>€</span>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(invoice)}
            >
              <Trash />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
