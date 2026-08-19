import type { Apartment, Debtor, Expense, Payment, Request } from "@/types";
import {
  APARTMENT_COOKIE_NAME,
  parseAuthContext,
  ROLE_COOKIE_NAME,
  type AuthContext,
} from "@/lib/role";

export function readCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const pair = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  if (!pair) return null;
  const value = pair.slice(name.length + 1);
  return decodeURIComponent(value);
}

export function getAuthContextFromRequest(request: Request): AuthContext {
  const cookieHeader = request.headers.get("cookie");
  const roleValue = readCookieValue(cookieHeader, ROLE_COOKIE_NAME);
  const apartmentIdValue = readCookieValue(cookieHeader, APARTMENT_COOKIE_NAME);
  return parseAuthContext(roleValue, apartmentIdValue);
}

export function canAccessApartment(auth: AuthContext, apartmentId: string): boolean {
  return auth.role === "admin" || auth.apartmentId === apartmentId;
}

export function requireApartmentId(auth: AuthContext): string {
  if (auth.role === "admin" || !auth.apartmentId) {
    throw new Error("Apartment scope is required for user role.");
  }
  return auth.apartmentId;
}

export function filterApartmentsByRole(auth: AuthContext, apartments: Apartment[]): Apartment[] {
  if (auth.role === "admin") return apartments;
  return apartments.filter((apartment) => apartment.id === auth.apartmentId);
}

export function filterPaymentsByRole(auth: AuthContext, payments: Payment[]): Payment[] {
  if (auth.role === "admin") return payments;
  return payments.filter((payment) => payment.apartmentId === auth.apartmentId);
}

export function filterExpensesByRole(auth: AuthContext, expenses: Expense[]): Expense[] {
  if (auth.role === "admin") return expenses;
  return expenses.filter((expense) => expense.apartmentId === auth.apartmentId);
}

export function filterDebtorsByRole(auth: AuthContext, debtors: Debtor[]): Debtor[] {
  if (auth.role === "admin") return debtors;
  return debtors.filter((debtor) => debtor.apartmentId === auth.apartmentId);
}

export function filterRequestsByRole(auth: AuthContext, requests: Request[]): Request[] {
  if (auth.role === "admin") return requests;
  return requests.filter((request) => request.apartmentId === auth.apartmentId);
}
