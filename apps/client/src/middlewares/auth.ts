import { AuthResponseData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware(req: NextRequest) {
  const authToken = req.cookies.get("refreshToken");

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return fetch(`${process.env.API_URL}/auth/refresh`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then(async (res) => {
      const data = (await res.json()) as AuthResponseData;
      const cookiesStore = await cookies();
      cookiesStore.set("access_token", data.access_token);
      cookiesStore.set("refreshToken", data.refreshToken);
      req.headers.set(
        "x-user",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          id: data.userId,
          enterpriseId: data.enterpriseId,
        })
      );

      // redirect if user is an enterprise and he's not in enterprise
      if (data.role === "enterprise" && !data.enterpriseId) {
        return NextResponse.redirect(new URL("/enterprise/create", req.url));
      }

      return NextResponse.next();
    })
    .catch(() => {
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
