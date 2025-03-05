"use server";

import {
  AuthResponseData,
  EnterpriseCreateModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";

export const fetchEnterpriseInfo = async (siret: string) => {
  return client<EnterpriseInformation>(`enterprises/information?siret=${siret}`)
    .then((data) => {
      return data;
    })
    .catch((e) => {
      return null;
    });
};

export const createEnterprise = async (
  enterprise: EnterpriseCreateModel,
  logo: File | undefined
) => {
  const formData = new FormData();
  Object.keys(enterprise).forEach((key) =>
    formData.append(key, enterprise[key])
  );
  if (logo) formData.append("logo", logo);
  var cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enterprises`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    body: formData,
  })
    .then(async (res) => {
      if (res.status === 200) {
        const data = (await res.json()) as AuthResponseData;
        return data;
      }
      return null;
    })
    .catch((e) => {
      return null;
    });
};
