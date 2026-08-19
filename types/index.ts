export interface Apartment {
  id: string;
  number: number;
  accountNumber: string; // НОВОЕ — лицевой счёт, напр. "ЛС-00147"
  area: number;
  ownerName: string;
  phone?: string;
  monthlyFee: number;
  balance: number;
  debt: number;
}

export interface Payment {
  id: string;
  apartmentId: string;
  apartmentNumber: number;
  ownerName: string;
  amount: number;
  method: "cash" | "bank";
  date: string;
  note?: string;
  receiptNumber: string;
}

export interface Accrual {
  id: string;
  period: string;
  totalAmount: number;
  apartments: number;
  type: string;
  status: "applied" | "pending";
  createdAt: string;
}

export interface Expense {
  id: string;
  apartmentId: string;
  category: "cleaning" | "repair" | "electrical" | "security" | "other";
  amount: number;
  description: string;
  contractor?: string;
  date: string;
  hasDocuments: boolean;
}

export interface Debtor {
  apartmentId: string;
  apartmentNumber: number;
  ownerName: string;
  debt: number;
  monthsOverdue: number;
  lastPayment: string;
}

export interface Request {
  id: string;
  apartmentId: string;
  apartmentNumber: number;
  subject: string;
  date: string;
  status: "new" | "in_progress" | "completed";
  assignee?: string;
  createdByRole: "admin" | "user";
}

export interface DashboardStats {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebt: number;
  paidApartments: number;
  totalApartments: number;
}

export type PaymentMethod = "cash" | "bank";
export type RequestStatus = "new" | "in_progress" | "completed";
export type ExpenseCategory =
  | "cleaning"
  | "repair"
  | "electrical"
  | "security"
  | "other";
