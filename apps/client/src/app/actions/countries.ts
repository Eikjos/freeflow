"use server";

import { CountryData } from "@repo/shared-types";

export const getCountries = async () => {
  return fetch(`${process.env.API_URL}/countries`, {
    credentials: "include",
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
  return fetch(`${process.env.API_URL}/countries/${id}`, {
    credentials: "include",
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
