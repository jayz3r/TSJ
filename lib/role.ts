export type UserRole = "admin" | "user";

export const ROLE_COOKIE_NAME = "tsj-role";
export const DEFAULT_ROLE: UserRole = "user";

export function parseRole(value?: string | null): UserRole {
  return value === "admin" ? "admin" : DEFAULT_ROLE;
}
