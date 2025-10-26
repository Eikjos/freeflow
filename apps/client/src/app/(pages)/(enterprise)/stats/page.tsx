import SalesCard from "@components/templates/sales-card";
import Loading from "@components/ui/loading";
import { Suspense } from "react";
import { getEnterpriseInscription } from "../../../../lib/api/enterprise";

export default async function StatsPage() {
  const inscriptionDate = await getEnterpriseInscription();

  return (
    <>
      <h1 className="font-amica text-4xl">Mes chiffres</h1>
      <Suspense
        fallback={
          <div className="h-full w-full flex flex-row justify-center items-center">
            <Loading />
          </div>
        }
      >
        <SalesCard
          className="mt-5"
          yearInscription={inscriptionDate.data ?? new Date().getFullYear()}
        />
      </Suspense>
    </>
  );
}
