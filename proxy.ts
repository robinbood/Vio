import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_RE = /(^|;\s*)(?:vio|trello)\.session=|(^|;\s*)(?:vio|trello)\.session_token=/;

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/sw.js",
];

const PROTECTED_PREFIXES = ["/boards", "/u", "/notifications", "/settings", "/billing", "/help", "/workspaces", "/templates", "/members", "/power-ups", "/cards"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasSession = SESSION_COOKIE_RE.test(cookieHeader);

  // Auth pages: bounce signed-in users to /boards
  if (hasSession && (pathname === "/login" || pathname === "/signup" || pathname === "/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/boards";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Protected pages: bounce guests to /login with redirect param
  if (!hasSession && isProtected(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on everything except static assets and the public file system.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
