import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "./lib/jwt";

const PUBLIC_PATHS = ["/onboarding"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!session && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (session && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Guard everything except api, static assets and the root redirect page.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
