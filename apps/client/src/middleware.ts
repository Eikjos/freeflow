import { type NextRequest } from "next/server";
import { AuthMiddleware } from "./middlewares/auth";
export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // switch (true) {
  //   // this will work on /register and /login
  //   case /^\/(register|login)$/.test(pathname):
  //     return guestMiddleware(request);
  //   case /^\/dashboard/.test(pathname):
  //     return authenticatedMiddleware(request);
  //   /*
  //   This middleware is going to work on /admin
  //   and any subpath eg. /admin/dashboard,
  //   /admin/users/create ...
  //   */
  //   case /^\/admin(\/.*)?$/.test(pathname):
  //     return adminMiddleware(request);
  // }
  return AuthMiddleware(request);
}

// here I made sure that the middleware works on every route
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
