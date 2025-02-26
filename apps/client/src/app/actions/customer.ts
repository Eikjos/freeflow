"use server";

import { CustomerModel, Pagination } from "@repo/shared-types";
import { cookies } from "next/headers";
import { generateQueryString } from "../../lib/utils";

export const GetCustomers = async (filter: Pagination) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token");
  const query = generateQueryString(filter);
  if (token == null) return [];
  return fetch(`${process.env.API_URL}/customers?${query}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as CustomerModel[];
      }
      return [];
    })
    .catch(() => {
      return [];
    });
};
