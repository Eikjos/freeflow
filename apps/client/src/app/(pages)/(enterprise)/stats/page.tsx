import CustomerStatCard from "@components/templates/customer-stat-card";
import EnterpriseStatCard from "@components/templates/enterprise-stat-card";
import SalesCard from "@components/templates/sales-card";
import Loading from "@components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Suspense } from "react";
import { getEnterpriseInscription } from "../../../../lib/api/enterprise";

export default async function StatsPage() {
  const inscriptionDate = await getEnterpriseInscription();
  const arrayYear = Array.from({
    length: new Date().getFullYear() - inscriptionDate.data! + 1,
  });

  return (
    <>
      <h1 className="font-amica text-4xl">Mes chiffres</h1>
      <Tabs defaultValue="default">
        <TabsList>
          <TabsTrigger value="default">Général</TabsTrigger>
          {arrayYear.map((_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <TabsTrigger key={year} value={year.toString()}>
                {year}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value="default">
          <Suspense
            fallback={
              <div className="h-full w-full flex flex-row justify-center items-center">
                <Loading />
              </div>
            }
          >
            <EnterpriseStatCard />
            <SalesCard
              className="mt-5"
              yearInscription={inscriptionDate.data ?? new Date().getFullYear()}
            />
            <CustomerStatCard className="mt-5" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}
