"use server";

import { AuthResponseData, LoginData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";
import { ServerActionsReturns } from "../../types/server-actions-type";

export const login = async (
  data: LoginData
): Promise<ServerActionsReturns<AuthResponseData>> => {
  const cookieStore = await cookies();
  return await client<AuthResponseData>(`auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    } as LoginData),
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
};
