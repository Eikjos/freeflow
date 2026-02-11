"use server"

import { AuthResponseData, CreateUserData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { client } from "../../lib/client";

export const createUser = async (user: CreateUserData, isEnterprise: boolean, token: string = '') => {
  const cookieStore = await cookies();
  return await client<AuthResponseData>(`users?isEnterprise=${isEnterprise}${token != '' ? `&token=${encodeURIComponent(token)}` : ''}`, {
    method: "POST",
    body: JSON.stringify({
      password: user.password,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName  
    } as CreateUserData)
  })
    .then((data) => {
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