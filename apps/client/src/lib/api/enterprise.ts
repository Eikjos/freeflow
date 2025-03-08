import { EnterpriseInformation } from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";

export const fetchEnterpriseInfo = async (siret: string) =>
  await client<EnterpriseInformation>(`enterprises/information?siret=${siret}`);

export const fetchEnterpriseInfoQueryOptions = (siret: string) =>
  queryOptions({
    queryKey: ["enterprise", "info", siret],
    queryFn: () => fetchEnterpriseInfo(siret),
    retry: false,
  });
