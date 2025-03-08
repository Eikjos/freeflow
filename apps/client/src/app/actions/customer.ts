"use server";

import { CustomerCreateModel, CustomerModel } from "@repo/shared-types";
import { client } from "../../lib/client";

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
