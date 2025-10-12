import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { EditEnterpriseData } from "@repo/shared-types";
import { useFormContext } from "react-hook-form";

type InvoiceInfoFormProps = {
  className?: string;
};

export default function InvoiceInfoForm({ className }: InvoiceInfoFormProps) {
  const form = useFormContext<EditEnterpriseData>();
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <h3 className="font-semibold">Information sur la facturation</h3>
        <div className="flex flex-row gap-4">
          <Input
            label="Prefixe de la facturation"
            className="w-2/3"
            {...form.register("invoicePrefixe")}
          />
          <Input
            label="Numero actuelle de la facturation"
            type="number"
            className="w-1/3"
            {...form.register("invoiceNumber")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
