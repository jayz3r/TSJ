import { NextResponse } from "next/server";
import { filterExpensesByRole, getAuthContextFromRequest } from "@/lib/authorization";
import { addExpenseState, getApartmentById, getExpensesState } from "@/lib/server-data";
import type { Expense, ExpenseCategory } from "@/types";

interface CreateExpenseBody {
  apartmentId?: string;
  category?: ExpenseCategory;
  amount?: number;
  description?: string;
  contractor?: string;
  date?: string;
}

export async function GET(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const expenses = filterExpensesByRole(auth, getExpensesState());
  return NextResponse.json({ role: auth.role, apartmentId: auth.apartmentId, expenses });
}

export async function POST(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const body = (await request.json()) as CreateExpenseBody;

  if (!body.category || !body.amount || !body.description) {
    return NextResponse.json({ message: "Некорректные данные расхода" }, { status: 400 });
  }

  const scopedApartmentId =
    auth.role === "admin" ? (body.apartmentId ?? auth.apartmentId) : auth.apartmentId;

  if (!scopedApartmentId) {
    return NextResponse.json({ message: "Не определён лицевой счёт пользователя" }, { status: 403 });
  }

  if (!getApartmentById(scopedApartmentId)) {
    return NextResponse.json({ message: "Квартира не найдена" }, { status: 404 });
  }

  const expense: Expense = {
    id: crypto.randomUUID(),
    apartmentId: scopedApartmentId,
    category: body.category,
    amount: Number(body.amount),
    description: body.description,
    contractor: body.contractor,
    date: body.date ?? new Date().toISOString().split("T")[0],
    hasDocuments: false,
  };

  addExpenseState(expense);
  const visibleExpenses = filterExpensesByRole(auth, getExpensesState());
  return NextResponse.json({ expense, expenses: visibleExpenses }, { status: 201 });
}
