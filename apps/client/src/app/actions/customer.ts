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

export const UpdateCustomer = async (
  id: number,
  model: CustomerCreateModel
) => {
  return client<CustomerModel>(`customers/${id}`, {
    method: "PUT",
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

export const DeleteCutomer = async (id: number) => {
  return client<any>(`customers/${id}`, { method: "DELETE" });
};

export const inviteCustomer = async (id: number) => 
  client(`customers/${id}/invite`, { method : "POST"})
