"use server";

import {
  CustomerCreateModel,
  CustomerModel,
  Pagination,
  PaginationResult,
} from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";
import { generateQueryString } from "../../lib/utils";

export const GetCustomers: (
  filter: Pagination
) => Promise<PaginationResult<CustomerModel> | null> = async (
  filter: Pagination
) => {
  const query = generateQueryString(filter);
  var cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers?${query}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.status === 200) {
        return (await res.json()) as PaginationResult<CustomerModel>;
      }
      return null;
    })
    .catch(() => {
      return null;
    });
};

export const CreateCustomer = async (model: CustomerCreateModel) => {
  return client<CustomerModel>(`customers`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(model),
  })
    .then(async (data) => {
      return data;
    })
    .catch(() => {
      return null;
    });
};
