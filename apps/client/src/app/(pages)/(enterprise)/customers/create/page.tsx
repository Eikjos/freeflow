import CustomerForm from "@components/templates/customer-form";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { getAllCountriesQueryOptions } from "../../../../../lib/api/countries";
import getQueryClient from "../../../../../lib/query-client";

export default async function CreateCustomerPage() {
  const queryClient = getQueryClient();
  const t = await getTranslations();
  void queryClient.prefetchQuery(getAllCountriesQueryOptions());

  return (
    <>
      <h1 className="font-amica text-4xl mb-20">{t("customer.create")}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerForm className="mt-20" />
      </HydrationBoundary>
    </>
  );
}
