import InvoiceLine from "@components/molecules/invoice-line";
import { InvoiceLineData } from "@repo/shared-types";

type InvoiceLineListProps = {
  invoices: InvoiceLineData[];
  handleChange: (values: InvoiceLineData[]) => void;
};

export default function InvoiceLineList({
  invoices,
  handleChange,
}: InvoiceLineListProps) {
  const handleChangeLine = (value: InvoiceLineData) => {
    const index = invoices.findIndex((e) => e.name === value.name);
    invoices[index] = value;
    handleChange(invoices);
  };

  const handleDeleteLine = (value: InvoiceLineData) => {
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
