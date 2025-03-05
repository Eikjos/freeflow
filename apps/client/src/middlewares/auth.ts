import { AuthResponseData } from "@repo/shared-types";
import { NextRequest, NextResponse } from "next/server";
import { client } from "../lib/client";
import { EnterpriseInfo } from "../types/enterprise-info-type";
import { UserInfoType as UserInfo } from "../types/user-info-types";

export async function AuthMiddleware(req: NextRequest) {
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
      responseOK.headers.set("x-current-path", req.nextUrl.pathname);
      responseOK.headers.set(
        "x-user",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          id: data.userId,
          enterpriseId: data.enterpriseId ?? undefined,
        } as UserInfo)
      );
      if (data.enterpriseId) {
        responseOK.headers.set(
          "x-enterprise",
          JSON.stringify({
            id: data.enterpriseId,
            name: data.enterpriseName,
            sales: data.sales ?? 0,
          } as EnterpriseInfo)
        );
      }

      // redirect if user is an enterprise and he's not in enterprise
      if (
        data.role === "enterprise" &&
        !data.enterpriseId &&
        req.nextUrl.pathname !== "/enterprises/create"
      ) {
        return NextResponse.redirect(new URL("/enterprises/create", req.url));
      }
      return responseOK;
    })
    .catch((e) => {
      console.log(e);
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
