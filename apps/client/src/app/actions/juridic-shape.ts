"use server";

import { JuridicShapeData } from "@repo/shared-types";
import { cookies } from "next/headers";

export const getJuridicShapes = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  if (token == null) return [];
  return fetch(`${process.env.API_URL}/juridic-shapes`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as JuridicShapeData[];
      }
      return [];
    })
    .catch(() => {
      return [];
    });
};

export const getJuridicShapeByCode = async (code: string) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  if (token == null) return undefined;
  return fetch(`${process.env.API_URL}/juridic-shapes/${code}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as JuridicShapeData;
      }
      return undefined;
    })
    .catch(() => {
      return undefined;
    });
};
