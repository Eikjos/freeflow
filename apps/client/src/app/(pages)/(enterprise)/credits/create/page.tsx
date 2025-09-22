import CreateCreditFormPage from "@components/organisms/create-credit-form-page";
import { InvoiceData } from "@repo/shared-types";
import { redirect } from "next/navigation";
import { client } from "../../../../../lib/client";

type CreateCreditsProps = {
  searchParams: Promise<{ invoiceId?: string }>;
};

export default async function CreateCredits({
  searchParams,
}: CreateCreditsProps) {
  const invoiceId = (await searchParams).invoiceId;

  if (!invoiceId || isNaN(Number(invoiceId))) {
    redirect("/invoices");
  }

  const invoice = await client<InvoiceData>(`invoices/${invoiceId}`);

  if (!invoice.ok || invoice.error) {
    redirect("/invoices");
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-amica mb-6">
        Créer un avoir sur la facture {invoice.data?.number}
      </h1>
      {invoice && invoice.ok && invoice.data && (
        <CreateCreditFormPage invoice={invoice.data} />
      )}
    </div>
  );
}
