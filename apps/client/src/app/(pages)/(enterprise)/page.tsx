import { KPICard } from "@components/molecules/kpi-card";
import ObjectiveCard from "@components/templates/objective-card";
import PrevisionsCard from "@components/templates/previsions-card";
import { client } from "../../../lib/client";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import UrgentTaskCard from "@components/templates/urgent-task-card";
import NotificationCard from "@components/templates/notifications-card";
import { Separator } from "@components/ui/separator";
import NotificationItemCard from "@components/templates/notification-item-card";
import StarRating from "@components/molecules/start-rating";

export default async function Home() {
  const customer = await client<number>("customers/count");
  const project = await client<number>("projects/count");
  const sale = await client<number>("sales/total");

  return (
    <div className="px-4 py-2">
  <h1 className="font-amica text-4xl mb-4">Tableau de bord</h1>

  {/* GRID KPI + OBJECTIFS + PREVISIONS */}
  <div
    className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-4 
      gap-5
    "
  >
    {/* Colonne KPI (prend 1 colonne sur mobile, 1 sur desktop) */}
    <div className="flex flex-col gap-3 order-1">
      <KPICard value={sale.data ?? 0} title="Chiffre d'affaire" type="sale" />
      <KPICard value={customer.data ?? 0} title="Clients" type="default" />
      <KPICard value={project.data ?? 0} title="Projets" type="default" />
    </div>

    {/* Objectifs (1 col mobile, 1 col desktop) */}
    <ObjectiveCard className="min-h-[260px] lg:h-[400px] order-2" />

    {/* Prévisions (sur desktop, prend 2 colonnes) */}
    <PrevisionsCard
      className="
        min-h-[260px] 
        lg:h-[400px] 
        order-3 
        sm:col-auto 
        md:col-span-2
      "
    />
  </div>

  {/* GRID Notifications + Urgent Tasks */}
  <div
    className="
      grid 
      grid-cols-1 
      lg:grid-cols-2 
      gap-5 
      mt-5
    "
  >
    <NotificationCard className="w-full" />
    <UrgentTaskCard className="w-full" />
  </div>

  {/* DERNIERS AVIS */}
  <Card className="w-full mt-5">
    <CardContent>
      <CardHeader className="px-0">Les derniers avis</CardHeader>

      <div
        className="
          flex 
          md:flex-row
          flex-col
          h-auto 
          lg:h-[300px]
          gap-5
          items-center
        "
      >
        {/* Note globale */}
        <div className="flex justify-center lg:justify-start w-1/3">
          <StarRating
            readOnly
            value={4.5}
            className="w-full"
          />
        </div>

        {/* Séparateur (visible seulement sur desktop) */}
        <Separator
          orientation="vertical"
          className="h-5/6 rounded-md bg-secondary sm:hidden lg:block justify-center"
        />

        {/* Avis récents */}
        <div className="bg-gray-300/10 rounded-md p-2 h-[250px] lg:h-[300px] w-full">
          <NotificationItemCard />
        </div>
      </div>
    </CardContent>
  </Card>
</div>


  );
}
