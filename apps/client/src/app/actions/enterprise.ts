"use server";

import {
  AuthResponseData,
  EnterpriseCreateModel,
  EnterpriseInformation,
} from "@repo/shared-types";
import { cookies } from "next/headers";

export const fetchEnterpriseInfo = async (siret: string) => {
  return await fetch(
    `${process.env.API_URL}/enterprises/information?siret=${siret}`,
    {
      credentials: "include",
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
  logo: File | undefined
) => {
  const formData = new FormData();
  Object.keys(enterprise).forEach((key) =>
    formData.append(key, enterprise[key])
  );
  if (logo) formData.append("logo", logo);
  return await fetch(`${process.env.API_URL}/enterprises`, {
    method: "POST",
    credentials: "include",
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
