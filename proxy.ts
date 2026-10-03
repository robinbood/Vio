import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
  "/verify-email",
  "/privacy",
  "/api/auth",
  "/favicon.ico",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
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

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/") || pathname.startsWith("/1/");
}

function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Let API handlers return JSON errors and validate credentials themselves.
  if (isApiRoute(pathname)) {
    const authorization = request.headers.get("authorization") ?? "";
    if (
      authorization.startsWith("Basic ") ||
      authorization.startsWith("Bearer ") ||
      hasSessionCookie(request)
    ) {
      return NextResponse.next();
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // This is an optimistic redirect only; layouts still verify the session.
  if (hasSessionCookie(request)) {
    return NextResponse.next();
  }

  const loginURL = new URL("/login", request.url);
  loginURL.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(loginURL);
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
