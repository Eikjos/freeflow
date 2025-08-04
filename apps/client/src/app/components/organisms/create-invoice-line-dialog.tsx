import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceLineData, InvoiceLineValidation } from "@repo/shared-types";
import { useForm } from "react-hook-form";

export type CreateInvoiceLineModal = {
  open: boolean;
  handleOpen: (value: boolean) => void;
  handleSubmit: (value: InvoiceLineData) => void;
};

export default function CreateInvoiceLineModal({
  open,
  handleOpen,
  handleSubmit,
}: CreateInvoiceLineModal) {
  const form = useForm<InvoiceLineData>({
    resolver: zodResolver(InvoiceLineValidation),
    defaultValues: {
      name: "",
      quantity: 1,
      unitPrice: 0.0,
    },
  });
  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");
  const userLocale = navigator.language;
  const currency = "EUR";

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const onSubmit = (values: InvoiceLineData) => {
    handleSubmit(values);
    handleOpenModal(false);
  };

  const handleOpenModal = (value: boolean) => {
    if (!value) form.reset();

    handleOpen(value);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={open} onOpenChange={handleOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl">
                Ajouter une ligne de facturation
              </DialogTitle>
            </DialogHeader>
            <Input label={"Nom"} placeholder="Nom" {...form.register("name")} />
            <Input
              label={"Quantité"}
              placeholder="Quantité"
              type="number"
              {...form.register("quantity", { valueAsNumber: true })}
            />
            <Input
              label={"Prix HT"}
              placeholder="Prix HT"
              type="number"
              {...form.register("unitPrice", {
                valueAsNumber: true,
              })}
            />
            <p>
              {quantity} x {formatPrice(unitPrice)} ={" "}
              {formatPrice(quantity * unitPrice)}
            </p>
            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
