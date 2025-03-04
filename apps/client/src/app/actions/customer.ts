"use server";

import {
  CustomerCreateModel,
  CustomerModel,
  Pagination,
  PaginationResult,
} from "@repo/shared-types";
import { generateQueryString } from "../../lib/utils";

export const GetCustomers: (
  filter: Pagination
) => Promise<PaginationResult<CustomerModel> | null> = async (
  filter: Pagination
) => {
  const query = generateQueryString(filter);
  return fetch(`${process.env.API_URL}/customers?${query}`, {
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
  return fetch(`${process.env.API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(model),
  })
    .then(async (res) => {
      console.log(res);
      if (res.status === 200) {
        return (await res.json()) as CustomerModel;
      }
      return null;
    })
    .catch(() => {
      return null;
    });
};
