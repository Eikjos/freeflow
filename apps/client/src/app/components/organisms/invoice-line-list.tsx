import InvoiceLine from "@components/molecules/invoice-line";
import { InvoiceLineCreateData } from "@repo/shared-types";

type InvoiceLineListProps = {
  invoices: InvoiceLineCreateData[];
  handleChange: (values: InvoiceLineCreateData[]) => void;
  canDelete?: boolean;
};

export default function InvoiceLineList({
  invoices,
  handleChange,
  canDelete = true,
}: InvoiceLineListProps) {
  const handleChangeLine = (value: InvoiceLineCreateData) => {
    const index = invoices.findIndex((e) => e.name === value.name);
    invoices[index] = value;
    handleChange(invoices);
  };

  const handleDeleteLine = (value: InvoiceLineCreateData) => {
    handleChange(invoices.filter((e) => e.name !== value.name));
  };

  return (
    <div className="w-full py-2 px-4 rounded-md bg-gray-200/20 mt-4">
      {invoices.map((invoice, index) => (
        <div key={index}>
          <InvoiceLine
            invoice={invoice}
            onChange={handleChangeLine}
            onDelete={handleDeleteLine}
            canDelete={canDelete}
          />
          {index < invoices.length - 1 && (
            <div className="my-4">
              <hr />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
