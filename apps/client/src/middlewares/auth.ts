import { AuthResponseData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { client } from "../lib/client";
import { EnterpriseInfo } from "../types/enterprise-info-type";
import { UserInfoType as UserInfo } from "../types/user-info-types";

export async function AuthMiddleware(req: NextRequest) {
  const cookieStore = await cookies();
  const cookiesStorage = req.cookies;
  const authToken = cookiesStorage.get("refreshToken");
  if (!authToken || authToken.value === "") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return client<AuthResponseData>(`auth/refresh`, {
    method: "post",
    credentials: "include",
    token: authToken.value,
  })
    .then((data) => {
      const responseOK = NextResponse.next();
      if (data.ok) {
        cookieStore.set("access_token", data?.data?.access_token ?? "");
        cookieStore.set("refreshToken", data?.data?.refreshToken ?? "");
        responseOK.headers.set("x-current-path", req.nextUrl.pathname);
        responseOK.headers.set(
          "x-user",
          JSON.stringify({
            firstName: data.data?.firstName,
            lastName: data.data?.lastName,
            id: data.data?.userId,
            enterpriseId: data.data?.enterpriseId ?? undefined,
          } as UserInfo)
        );
        if (data.data?.enterpriseId) {
          responseOK.headers.set(
            "x-enterprise",
            JSON.stringify({
              id: data.data?.enterpriseId,
              name: data.data?.enterpriseName,
              sales: data.data?.sales ?? 0,
            } as EnterpriseInfo)
          );
        }

        // redirect if user is an enterprise and he's not in enterprise
        if (
          data.data?.role === "enterprise" &&
          !data.data?.enterpriseId &&
          req.nextUrl.pathname !== "/enterprises/create"
        ) {
          return NextResponse.redirect(new URL("/enterprises/create", req.url));
        }
        return responseOK;
      }
      cookieStore.delete("access_token");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", req.url));
    })
    .catch((e) => {
      cookieStore.delete("access_token");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
