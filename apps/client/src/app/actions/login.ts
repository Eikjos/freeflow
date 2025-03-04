"use server";

import { AuthResponseData, LoginData } from "@repo/shared-types";
import { ServerActionsReturns } from "../../types/server-actions-type";

export const login = async (
  data: LoginData
): Promise<ServerActionsReturns<AuthResponseData>> => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    } as LoginData),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
