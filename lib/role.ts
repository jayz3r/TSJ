export type UserRole = "admin" | "user";

export const ROLE_COOKIE_NAME = "tsj-role";
export const APARTMENT_COOKIE_NAME = "tsj-apartment-id";
export const DEFAULT_ROLE: UserRole = "user";
export const DEFAULT_USER_APARTMENT_ID = "1";

export function parseRole(value?: string | null): UserRole {
  return value === "admin" ? "admin" : DEFAULT_ROLE;
}

export interface AuthContext {
  role: UserRole;
  apartmentId: string | null;
}

export function parseApartmentId(value?: string | null): string | null {
  if (!value) return null;
  return value.trim() ? value : null;
}

export function parseAuthContext(
  roleValue?: string | null,
  apartmentIdValue?: string | null,
): AuthContext {
  const role = parseRole(roleValue);
  if (role === "admin") {
    return { role, apartmentId: null };
  }

  return {
    role,
    apartmentId: parseApartmentId(apartmentIdValue) ?? DEFAULT_USER_APARTMENT_ID,
  };
}
