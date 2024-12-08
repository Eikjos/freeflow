"use server";

import { AuthResponseData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { ServerActionsReturns } from "../../types/server-actions-type";

export const login = async (
  email: string,
  password: string
): Promise<ServerActionsReturns> => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return await fetch(`${process.env.API_URL}/auth/login`, {
    method: "post",
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = (await res.json()) as Error;
        return {
          success: false,
          message: error.message,
        };
      }
      const data = (await res.json()) as AuthResponseData;
      const cookiesStore = await cookies();
      cookiesStore.set("access_token", data.access_token);
      cookiesStore.set("refreshToken", data.refreshToken);
      return {
        success: true,
        data,
      };
    })
    .catch((e) => {
      console.error(e);
      return {
        success: false,
        message: "Une erreur est survenue",
      };
    });
};
