import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/home", "/chat", "/voice", "/meetings", "/knowledge-base", "/video", "/search", "/workflows", "/agents", "/analytics", "/notifications", "/teams", "/profile", "/admin"];

export function middleware(_request: NextRequest) {
  // TODO: Re-enable auth guard before production deployment
  // Auth bypass active for local development without backend
  return NextResponse.next();

  /* Original auth guard — uncomment when backend is available:
  const { pathname } = _request.nextUrl;
  const hasSession = Boolean(_request.cookies.get("next-auth.session-token") || _request.cookies.get("__Secure-next-auth.session-token"));
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", _request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
  */
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};

