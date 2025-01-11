"use server";

import { EnterpriseInformation } from "@repo/shared-types";
import { cookies } from "next/headers";

export const fetchEnterpriseInfo = async (siret: string) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  return await fetch(
    `${process.env.API_URL}/enterprise/information?siret=${siret}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then(async (res) => (await res.json()) as EnterpriseInformation)
    .catch((e) => {
      console.log(e);
    });
};
