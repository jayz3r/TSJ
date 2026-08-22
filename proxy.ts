import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ACCOUNT_COOKIE_NAME,
  parseRole,
  ROLE_COOKIE_NAME,
} from "@/lib/role";

export function proxy(request: NextRequest) {
  const role = parseRole(request.cookies.get(ROLE_COOKIE_NAME)?.value);
  const account = request.cookies.get(ACCOUNT_COOKIE_NAME)?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/apartments")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/resident", request.url));
    }

    return NextResponse.next();
  }

  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/accruals") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/debts") ||
    pathname.startsWith("/requests") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings")
  ) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/resident", request.url));
    }
  }

  if (pathname === "/residents") {
    return NextResponse.redirect(new URL("/resident", request.url));
  }

  if (pathname.startsWith("/resident/")) {
    if (!account) {
      return NextResponse.redirect(new URL("/resident", request.url));
    }

    const requestedAccount = decodeURIComponent(pathname.split("/")[2] ?? "");
    if (requestedAccount !== account) {
      return NextResponse.redirect(new URL(`/resident/${encodeURIComponent(account)}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/apartments/:path*",
    "/dashboard",
    "/accruals/:path*",
    "/payments/:path*",
    "/expenses/:path*",
    "/debts/:path*",
    "/requests/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/residents",
    "/resident/:path*",
  ],
};
