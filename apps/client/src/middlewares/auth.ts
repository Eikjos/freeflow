import { AuthResponseData } from "@repo/shared-types";
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
      Cookie: `refreshToken=${authToken.value}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) {
        const data = (await res.json()) as AuthResponseData;
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
      }
      console.log(res.status);
      return NextResponse.redirect(new URL("/login", req.url));
    })
    .catch((e) => {
      console.log(e);
      return NextResponse.redirect(new URL("/login", req.url));
    });
}
