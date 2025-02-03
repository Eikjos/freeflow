"use server";

import {
  AuthResponseData,
  EnterpriseCreateModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { cookies } from "next/headers";

export const fetchEnterpriseInfo = async (siret: string) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  console.log(token);
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
      return null;
    })
    .catch((e) => {
      return null;
    });
};

export const createEnterprise = async (
  enterprise: EnterpriseCreateModel,
  logo: File
) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  if (token == null) return null;

  const formData = new FormData();
  Object.keys(enterprise).forEach((key) =>
    formData.append(key, enterprise[key])
  );
  formData.append("logo", logo);
  return await fetch(`${process.env.API_URL}/enterprises`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: formData,
  })
    .then(async (res) => {
      if (res.status === 200) {
        const data = (await res.json()) as AuthResponseData;
        cookiesStore.set("access_token", data.access_token);
        cookiesStore.set("refreshToken", data.refreshToken);
        return data;
      }
      return null;
    })
    .catch((e) => {
      return null;
    });
};
