"use server";

import {
  EnterpriseCreateModel,
  EnterpriseInformation,
} from "@repo/shared-types";
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
      return null;
    })
    .catch((e) => {
      return null;
    });
};

export const createEnterprise = async (
  enterprise: EnterpriseCreateModel,
  logo: Blob
) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  if (token == null) return null;

  const formData = new FormData();
  formData.append("model", JSON.stringify(enterprise)); // Ajouter l'objet sous forme de chaîne
  formData.append("file", logo);
  return await fetch(`${process.env.API_URL}/enterprises`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: formData,
  })
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
