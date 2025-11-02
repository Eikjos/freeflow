import CustomerStatCard from "@components/templates/customer-stat-card";
import EnterpriseStatCard from "@components/templates/enterprise-stat-card";
import SalesCard from "@components/templates/sales-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
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
          <EnterpriseStatCard />
          <SalesCard
            className="mt-5"
            title={"Chiffre d'affaires sur les 3 dernières années"}
            yearInscription={inscriptionDate.data ?? new Date().getFullYear()}
          />
          <CustomerStatCard className="mt-5" />
        </TabsContent>
        {arrayYear.map((_, index) => {
          const year = new Date().getFullYear() - index;
          return (
            <TabsContent value={year.toString()} key={index}>
              <EnterpriseStatCard year={year} />
              <SalesCard
                className="mt-5"
                year={year}
                title={`Chiffre d'affaires en ${year}`}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
