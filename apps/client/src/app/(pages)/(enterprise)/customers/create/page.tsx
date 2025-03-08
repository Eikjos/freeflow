import CustomerForm from "@components/templates/customer-form";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllCountriesQueryOptions } from "../../../../../lib/api/countries";
import getQueryClient from "../../../../../lib/query-client";

export default function CreateCustomerPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getAllCountriesQueryOptions());

  return (
    <>
      <h1 className="font-amica text-4xl mb-4">Création d'un client</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerForm className="mt-20" />
      </HydrationBoundary>
    </>
  );
}
