"use client";

import { KPICard } from "@components/molecules/kpi-card";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getEnterpriseStatQueryOptions } from "../../../lib/api/enterprise";
import { cn } from "../../../lib/utils";

export type EnterpriseStatCardProps = {
  year?: number;
  className?: string;
};

export default function EnterpriseStatCard({
  year,
  className,
}: EnterpriseStatCardProps) {
  const { data } = useQuery(getEnterpriseStatQueryOptions(year));
  const t = useTranslations();

  return (
    <div className={cn("flex flex-row item-center w-full gap-4", className)}>
      <KPICard
        type="sale"
        title={t("common.sales")}
        value={data?.data?.sales ?? 0}
        className="w-1/3"
      />
      <KPICard
        type="expense"
        title={t("common.expenses")}
        value={data?.data?.expenses ?? 0}
        className="w-1/3"
      />
      <KPICard
        type="profit"
        title={t("common.profits")}
        value={data?.data?.profit ?? 0}
        className="w-1/3"
      />
    </div>
  );
}
