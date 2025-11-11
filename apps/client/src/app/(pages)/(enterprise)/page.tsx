import { KPICard } from "@components/molecules/kpi-card";
import ObjectiveCard from "@components/templates/objective-card";
import PrevisionsCard from "@components/templates/previsions-card";

export default function Home() {
  return (
    <div className="px-4 py-2">
      <h1 className="font-amica text-4xl">Tableau de bord</h1>
      <div className="flex flex-row w-full items-center gap-5">
        <div className="flex flex-col gap-3 w-1/4">
          <KPICard value={1200} title={"Chiffre d'affaire"} type="sale" />
          <KPICard title={"Clients"} value={23} type="default" />
          <KPICard title={"Projets"} value={123} type="default" />
        </div>
        <ObjectiveCard className="w-1/4 h-[400px]" />
        <PrevisionsCard className="w-2/4 h-[400px]" />
      </div>
    </div>
  );
}
