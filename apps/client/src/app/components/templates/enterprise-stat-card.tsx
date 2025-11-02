"use client";

import { KPICard } from "@components/molecules/kpi-card";
import { useQuery } from "@tanstack/react-query";
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
  const { data, isLoading } = useQuery(getEnterpriseStatQueryOptions(year));

  return (
    <div className={cn("flex flex-row item-center w-full gap-4", className)}>
      <KPICard
        type="sale"
        title={"Chiffre d'affaire"}
        value={data?.data?.sales ?? 0}
        className="w-1/3"
      />
      <KPICard
        type="expense"
        title={"Dépenses"}
        value={data?.data?.expenses ?? 0}
        className="w-1/3"
      />
      <KPICard
        type="profit"
        title={"Bénéfices"}
        value={data?.data?.profit ?? 0}
        className="w-1/3"
      />
    </div>
  );
}
