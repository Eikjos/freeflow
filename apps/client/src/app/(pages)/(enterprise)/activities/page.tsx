import ProjectTab from "@components/templates/project-tab";
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
        {t("activities.enterprise", { enterprise: enterprise?.name ?? "" })}
      </h1>
      <ProjectTab enterpriseId={enterprise?.id ?? 0} />
    </div>
  );
}
