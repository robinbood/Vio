import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
  "/privacy",
  "/api/auth",
  "/favicon.ico",
  "/sw.js",
];

function matchesPath(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => matchesPath(pathname, path));
}

function hasSessionCookie(request: NextRequest): boolean {
  return [
    "vio.session_token",
    "vio.session_data",
    "__Secure-vio.session_token",
    "__Secure-vio.session_data",
  ].some((name) => request.cookies.has(name));
}

function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!hasSessionCookie(request) && !isPublicPath(pathname)) {
    const loginURL = new URL("/login", request.url);
    loginURL.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
