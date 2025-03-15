"use client";

import CustomerForm from "@components/templates/customer-form";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { getCustomerByIdOptions } from "../../../../../../lib/api/customers";

type EditCustomerPageProps = {
  id: string;
};

export default function EditCustomerPage() {
  const { id }: EditCustomerPageProps = useParams();
  const { data } = useQuery(getCustomerByIdOptions(id));

  if (data && !data?.ok) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-amica text-4xl mb-4">
        Edition du client {data?.data?.name}
      </h1>
      <CustomerForm edit customerId={parseInt(id)} data={data?.data} />
    </div>
  );
}
