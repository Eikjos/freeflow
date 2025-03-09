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
      cookieStore.set("access_token", data.access_token);
      cookieStore.set("refreshToken", data.refreshToken);
      return {
        success: true,
        data,
      };
    })
    .catch((e: Error) => {
      return {
        success: false,
        message: e.message,
      };
    });
};
