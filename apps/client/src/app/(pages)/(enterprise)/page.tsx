import { KPICard } from "@components/molecules/kpi-card";
import ObjectiveCard from "@components/templates/objective-card";
import PrevisionsCard from "@components/templates/previsions-card";
import { client } from "../../../lib/client";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import UrgentTaskCard from "@components/templates/urgent-task-card";
import NotificationCard from "@components/templates/notifications-card";

export default async function Home() {
  const customer = await client<number>("customers/count");
  const project = await client<number>("projects/count");
  const sale = await client<number>("sales/total");

  return (
    <div className="px-4 py-2">
      <h1 className="font-amica text-4xl">Tableau de bord</h1>
      <div className="flex flex-row w-full items-center gap-5">
        <div className="flex flex-col gap-3 w-1/4">
          <KPICard
            value={sale.data ?? 0}
            title={"Chiffre d'affaire"}
            type="sale"
          />
          <KPICard
            title={"Clients"}
            value={customer.data ?? 0}
            type="default"
          />
          <KPICard title={"Projets"} value={project.data ?? 0} type="default" />
        </div>
        <ObjectiveCard className="w-1/4 h-[400px]" />
        <PrevisionsCard className="w-2/4 h-[400px]" />
      </div>
      <div className="w-full flex-row flex items-center gap-5 mt-5">
        <NotificationCard  className="w-1/2"/>
        <UrgentTaskCard  className="w-1/2"/>
      </div>
      <Card className="w-full mt-5">
        <CardContent>
          <CardHeader className="px-0">Les derniers avis</CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}
