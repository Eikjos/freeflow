import { AuthResponseData } from "@repo/shared-types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { EnterpriseInfo } from "../types/enterprise-info-type";
import { UserInfoType as UserInfo } from "../types/user-info-types";

export async function AuthMiddleware(req: NextRequest) {
  const cookiesStorage = req.cookies;
  const authToken = cookiesStorage.get("refreshToken");

  if (!authToken || authToken.value === "") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${authToken.value}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        const data = (await res.json()) as AuthResponseData;
        const cookiesStore = await cookies();
        cookiesStore.set("access_token", data.access_token);
        cookiesStore.set("refreshToken", data.refreshToken);
        const responseOK = NextResponse.next();
        responseOK.headers.set("x-current-path", req.nextUrl.pathname);
        responseOK.headers.set(
          "x-user",
          JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            id: data.userId,
            enterpriseId: data.enterpriseId,
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
          return NextResponse.redirect(new URL("/enterprise/create", req.url));
        }
        return responseOK;
      }
      return NextResponse.redirect(new URL("/login", req.url));
    })
    .catch(() => {
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
