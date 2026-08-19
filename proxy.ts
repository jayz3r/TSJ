import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseRole, ROLE_COOKIE_NAME } from "@/lib/role";

export function proxy(request: NextRequest) {
  const role = parseRole(request.cookies.get(ROLE_COOKIE_NAME)?.value);

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/residents", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/residents/:path*", "/apartments/:path*"],
};
