import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Proxy (formerly Middleware) - the first, cheap gate for the admin
 * console. A visitor with no `refreshToken` cookie can't have a session, so
 * redirect them to /login before the admin bundle is ever sent.
 *
 * The gate is deliberately one-directional and presence-only. A *present*
 * cookie is NOT proof of a live session (it can be stale — e.g. a reset DB), so
 * we must NOT also redirect cookie-bearing visitors away from /login: that would
 * fight `RequireAuth`, which does the real `GET /auth/me` validation and, on
 * failure, clears the cookie and returns to /login. Bouncing both ways on cookie
 * presence loops. So /login is left alone here and RequireAuth is the authority.
 */
const SESSION_COOKIE = "refreshToken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
