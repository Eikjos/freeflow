"use server";

import CustomerTable from "@components/templates/customer-table";
import { Button } from "@components/ui/button";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import { getAllCustomersQueryOptions } from "../../../../lib/api/customers";
import getQueryClient from "../../../../lib/query-client";
import { EnterpriseInfo } from "../../../../types/enterprise-info-type";

export default async function CustomerPage() {
  const t = await getTranslations();
  const headersEnterprise = (await headers()).get("x-enterprise");
  const enterprise: EnterpriseInfo | null = headersEnterprise
    ? JSON.parse(headersEnterprise) as EnterpriseInfo
    : null;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    getAllCustomersQueryOptions({ page: 0, pageSize: 10 })
  );

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="font-amica text-4xl">
          {t("customer.title", { enterprise: enterprise?.name ?? "" })}
        </h1>
        <Button asChild>
          <Link href={"/customers/create"}>
            {t("common.add")} <Plus />
          </Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerTable />
      </HydrationBoundary>
    </div>
  );
}
