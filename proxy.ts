import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth/constants";

// Optimistic gate only: it checks that a session cookie *exists* so anonymous
// visitors never reach admin routes. The real check (token hash lookup,
// expiry, role) happens server-side in lib/auth/dal.ts for every page,
// server action and route handler.
export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
