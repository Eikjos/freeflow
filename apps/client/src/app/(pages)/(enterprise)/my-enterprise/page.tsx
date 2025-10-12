import EnterpriseSettings from "@components/organisms/enterprise-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function MyEnterprisePage() {
  return (
    <>
      <h1 className="font-amica text-4xl">Mon entreprise</h1>
      <Tabs defaultValue="enterprise" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="enterprise" className="w-1/2">
            Entrerprise
          </TabsTrigger>
          <TabsTrigger value="objectif" className="w-1/2">
            Objectifs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enterprise">
          <EnterpriseSettings />
        </TabsContent>
      </Tabs>
    </>
  );
}
