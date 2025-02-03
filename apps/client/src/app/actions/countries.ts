"use server";

import { CountryData } from "@repo/shared-types";
import { cookies } from "next/headers";

export const getCountries = async () => {
  const token = (await cookies()).get("access_token");
  if (token == null) return [];
  return fetch(`${process.env.API_URL}/countries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as CountryData[];
      }
      return [];
    })
    .catch(() => {
      return [];
    });
};

export const getCountryById = async (id: number) => {
  const token = (await cookies()).get("access_token");
  if (token == null) return undefined;
  return fetch(`${process.env.API_URL}/countries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as CountryData;
      }
      return undefined;
    })
    .catch(() => {
      return undefined;
    });
};
