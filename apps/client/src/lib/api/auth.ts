import { AuthResponseData } from "@repo/shared-types";
import { client } from "../client";

export const refresh = async (refreshToken: string) => 
  await client<AuthResponseData>(`auth/refresh`, {
    method: "post",
    credentials: "include",
    token: refreshToken,
  })