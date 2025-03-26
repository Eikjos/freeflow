import ProjectTab from "@components/templates/project-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { EnterpriseInfo } from "../../../../types/enterprise-info-type";

export default async function ActivitiesPage() {
  const t = await getTranslations();
  const headersEnterprise = (await headers()).get("x-enterprise");
  const enterprise: EnterpriseInfo | null = headersEnterprise
    ? JSON.parse(headersEnterprise)
    : null;
  return (
    <div>
      <h1 className="font-amica text-4xl">
        Les activités de {enterprise?.name}
      </h1>
      <Tabs defaultValue="projects" className="mt-5">
        <TabsList>
          <TabsTrigger value="projects">Mes projets</TabsTrigger>
          <TabsTrigger value="tasks">Mes tâches en cours</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <ProjectTab enterpriseId={enterprise?.id ?? 0} />
        </TabsContent>
        <TabsContent value="tasks">
          <p>Mes tâches en cours</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
