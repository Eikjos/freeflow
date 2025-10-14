"use client";

import EnterpriseSettingsForm from "@components/templates/enterprise-settings-form";
import Loading from "@components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { useEnterprise } from "providers/enterprise-provider";
import { getEntepriseQueryOptions } from "../../../lib/api/enterprise";

export default function EnterpriseSettings() {
  const { enterprise } = useEnterprise();
  const { data, isLoading } = useQuery({
    ...getEntepriseQueryOptions(enterprise?.id!),
  });

  if (isLoading) {
    return (
      <div className="flex flex-row h-[75vh] w-full justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <EnterpriseSettingsForm enterprise={data?.data!} />
    </>
  );
}
