"use server";

import CustomerTable from "@components/templates/customer-table";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { EnterpriseInfo } from "../../../../types/enterprise-info-type";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function CustomerPage() {
  const headersEnterprise = (await headers()).get("x-enterprise");
  const enterprise: EnterpriseInfo | null = headersEnterprise
    ? JSON.parse(headersEnterprise)
    : null;

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="font-amica text-4xl">
          Les clients de {enterprise?.name}
        </h1>
        <Button asChild>
          <Link href={"/customers/create"}>
            Ajouter <Plus />
          </Link>
        </Button>
      </div>
      <HydrationBoundary>
        <CustomerTable />
      </HydrationBoundary>
    </div>
  );
}
