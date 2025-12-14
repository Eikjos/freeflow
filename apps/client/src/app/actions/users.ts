"use server"

import { AuthResponseData, CreateUserData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";

export const createUser = async (user: CreateUserData, isEnterprise: boolean) => {
  const cookieStore = await cookies();
  const { confirmPassword, ...data } = user;
  return await client<AuthResponseData>(`users?isEnterprise=${isEnterprise}`, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(async (data) => {
      if (data.ok) {
        cookieStore.set("access_token", data.data?.access_token ?? "");
        cookieStore.set("refreshToken", data.data?.refreshToken ?? "");
        return {
          success: true,
          data: data.data,
        };
      }
      return {
        success: false,
        message: data.error,
      };
    })
    .catch((e: Error) => {
      return {
        success: false,
        message: e.message,
      };
    });
}