import EnterpriseSettings from "@components/organisms/enterprise-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useTranslations } from "next-intl";

export default function MyEnterprisePage() {
  const t = useTranslations();
  return (
    <>
      <h1 className="font-amica text-4xl">{t("enterprise.my")}</h1>
      <Tabs defaultValue="enterprise" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="enterprise" className="w-1/2">
            {t("tabs.enterprise")}
          </TabsTrigger>
          <TabsTrigger value="objectif" className="w-1/2">
            {t("tabs.objective")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enterprise">
          <EnterpriseSettings />
        </TabsContent>
      </Tabs>
    </>
  );
}
