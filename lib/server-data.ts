import {
  mockAccruals,
  mockApartments,
  mockDebtors,
  mockExpenses,
  mockPayments,
  mockRequests,
} from "@/lib/mock-data";
import type { Accrual, Apartment, Debtor, Expense, Payment, Request } from "@/types";

const apartmentsState: Apartment[] = [...mockApartments];
const paymentsState: Payment[] = [...mockPayments];
const accrualsState: Accrual[] = [...mockAccruals];
const expensesState: Expense[] = [...mockExpenses];
const debtorsState: Debtor[] = [...mockDebtors];
const requestsState: Request[] = [...mockRequests];

export function getApartmentsState(): Apartment[] {
  return apartmentsState;
}

export function getApartmentById(apartmentId: string): Apartment | undefined {
  return apartmentsState.find((apartment) => apartment.id === apartmentId);
}

export function getApartmentByNumber(apartmentNumber: number): Apartment | undefined {
  return apartmentsState.find((apartment) => apartment.number === apartmentNumber);
}

export function getPaymentsState(): Payment[] {
  return paymentsState;
}

export function getAccrualsState(): Accrual[] {
  return accrualsState;
}

export function getExpensesState(): Expense[] {
  return expensesState;
}

export function addExpenseState(expense: Expense): void {
  expensesState.unshift(expense);
}

export function getDebtorsState(): Debtor[] {
  return debtorsState;
}

export function getRequestsState(): Request[] {
  return requestsState;
}

export function addRequestState(request: Request): void {
  requestsState.unshift(request);
}

export function updateRequestState(
  requestId: string,
  updates: Pick<Request, "status" | "assignee">,
): Request | null {
  const index = requestsState.findIndex((request) => request.id === requestId);
  if (index === -1) return null;
  requestsState[index] = {
    ...requestsState[index],
    status: updates.status,
    assignee: updates.assignee ?? requestsState[index].assignee,
  };
  return requestsState[index];
}
