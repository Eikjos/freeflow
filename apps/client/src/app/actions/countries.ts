"use server";

import { CountryData } from "@repo/shared-types";
import { cookies } from "next/headers";

export const getCountries = async () => {
  const token = (await cookies()).get("access_token");
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
    .catch((e) => {
      return [];
    });
};
