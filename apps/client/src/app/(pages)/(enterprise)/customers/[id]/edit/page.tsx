"use server";

import CustomerForm from "@components/templates/customer-form";
import { CustomerDetailModel } from "@repo/shared-types";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { client } from "../../../../../../lib/client";

type EditCustomerParams = {
  id: string;
};

type EditCustomerPageProps = {
  params: Promise<EditCustomerParams>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;
  const customer = await client<CustomerDetailModel>(`customers/${id}`);
  const t = await getTranslations();

  if (customer && !customer.ok) {
    notFound();
  }

  return (
    <div>
      {customer && customer?.ok && (
        <>
          <h1 className="font-amica text-4xl mb-20">
            {t("customer.edit", { customer: customer.data?.name ?? "" })}
          </h1>
          <CustomerForm edit customerId={parseInt(id)} data={customer.data} />
        </>
      )}
    </div>
  );
}
