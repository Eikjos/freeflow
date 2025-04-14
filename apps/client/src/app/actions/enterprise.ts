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
  return client<AuthResponseData>(
    `${process.env.NEXT_PUBLIC_API_URL}/enterprises`,
    {
      method: "POST",
      body: formData,
    }
  ).then(async (res) => {
    if (res.ok && res.data) {
      cookieStore.set("access_token", res.data.access_token);
      cookieStore.set("refreshToken", res.data.refreshToken);
      return res.data;
    }
    throw new Error(res.error);
  });
};
