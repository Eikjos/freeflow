import { AuthResponseData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { client } from "../lib/client";

export async function AuthMiddleware(req: NextRequest) {
  const authToken = req.cookies.get("refreshToken");

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return client<AuthResponseData>("auth/refresh", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then(async (data) => {
      const cookiesStore = await cookies();
      cookiesStore.set("access_token", data.access_token);
      cookiesStore.set("refreshToken", data.refreshToken);
      req.headers.set(
        "x-user",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
        })
      );

      return NextResponse.next();
    })
    .catch(() => {
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
