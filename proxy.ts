import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  APARTMENT_COOKIE_NAME,
  DEFAULT_USER_APARTMENT_ID,
  parseApartmentId,
  parseAuthContext,
  ROLE_COOKIE_NAME,
} from "@/lib/role";

export function proxy(request: NextRequest) {
  const roleValue = request.cookies.get(ROLE_COOKIE_NAME)?.value;
  const apartmentIdValue = request.cookies.get(APARTMENT_COOKIE_NAME)?.value;
  const auth = parseAuthContext(roleValue, apartmentIdValue);
  const pathname = request.nextUrl.pathname;

  if (auth.role !== "admin" && pathname.startsWith("/admin/")) {
    const response = NextResponse.redirect(new URL("/residents", request.url));
    response.cookies.set(APARTMENT_COOKIE_NAME, auth.apartmentId ?? DEFAULT_USER_APARTMENT_ID, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  if (auth.role !== "admin" && pathname.startsWith("/apartments")) {
    const response = NextResponse.redirect(new URL("/residents", request.url));
    response.cookies.set(APARTMENT_COOKIE_NAME, auth.apartmentId ?? DEFAULT_USER_APARTMENT_ID, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  if (auth.role !== "admin" && pathname.startsWith("/residents/")) {
    const residentId = pathname.split("/")[2];
    if (residentId && auth.apartmentId && residentId !== auth.apartmentId) {
      const response = NextResponse.redirect(
        new URL(`/residents/${auth.apartmentId}`, request.url),
      );
      response.cookies.set(APARTMENT_COOKIE_NAME, auth.apartmentId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
      return response;
    }
  }

  const response = NextResponse.next();
  if (auth.role !== "admin" && !parseApartmentId(apartmentIdValue)) {
    response.cookies.set(APARTMENT_COOKIE_NAME, auth.apartmentId ?? DEFAULT_USER_APARTMENT_ID, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/apartments/:path*",
    "/residents/:path*",
    "/expenses/:path*",
    "/debts/:path*",
    "/requests/:path*",
    "/api/residents/:path*",
    "/api/expenses/:path*",
    "/api/debts/:path*",
    "/api/requests/:path*",
  ],
};
