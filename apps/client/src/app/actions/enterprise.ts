"use server";

import { EnterpriseInformation } from "@repo/shared-types";
import { cookies } from "next/headers";

export const fetchEnterpriseInfo = async (siret: string) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  if (token == null) return null;
  return await fetch(
    `${process.env.API_URL}/enterprises/information?siret=${siret}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as EnterpriseInformation;
      }
      console.log(res);
      return null;
    })
    .catch((e) => {
      return null;
    });
};
