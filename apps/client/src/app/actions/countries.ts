"use server";

import { CountryData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";

export const getCountries = async () => {
  return client<CountryData[]>(`countries`)
    .then((data) => {
      return data;
    })
    .catch(() => {
      return [];
    });
};

export const getCountryById = async (id: number) => {
  var cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries/${id}`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token?.value}`,
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
