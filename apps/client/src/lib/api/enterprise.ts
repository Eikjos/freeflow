import { EnterpriseInformation } from "@repo/shared-types";
import { client } from "../client";

export const fetchEnterpriseInfo = async (siret: string) =>
  await client<EnterpriseInformation>(`enterprises/information?siret=${siret}`);
