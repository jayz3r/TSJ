'use client';

import { create } from 'zustand';
import type { Apartment, Payment, Accrual, Expense, Request } from '@/types';
import { mockApartments, mockPayments, mockAccruals, mockExpenses, mockRequests } from '@/lib/mock-data';
import { generateReceiptNumber } from '@/lib/utils';

interface AppState {
  apartments: Apartment[];
  payments:   Payment[];
  accruals:   Accrual[];
  expenses:   Expense[];
  requests:   Request[];

  addPayment:           (data: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;
  addExpense:           (data: Omit<Expense, 'id'>) => void;
  addAccrual:           (data: Omit<Accrual, 'id' | 'createdAt'>) => void;
  addRequest:           (data: Omit<Request, 'id'>) => void;
  updateRequestStatus:  (id: string, status: Request['status'], assignee?: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  apartments: mockApartments,
  payments:   mockPayments,
  accruals:   mockAccruals,
  expenses:   mockExpenses,
  requests:   mockRequests,

  addPayment: (data) => {
    const payment: Payment = {
      ...data,
      id: crypto.randomUUID(),
      receiptNumber: generateReceiptNumber(),
    };
    set((state) => {
      const updatedApts = state.apartments.map((apt) => {
        if (apt.id !== data.apartmentId) return apt;
        return {
          ...apt,
          balance: apt.balance + data.amount,
          debt:    Math.max(0, apt.debt - data.amount),
        };
      });
      return { payments: [payment, ...state.payments], apartments: updatedApts };
    });
    return payment;
  },

  addExpense: (data) =>
    set((s) => ({ expenses: [{ ...data, id: crypto.randomUUID() }, ...s.expenses] })),

  addAccrual: (data) =>
    set((s) => ({
      accruals: [{ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...s.accruals],
    })),

  addRequest: (data) => {
    const id = String(parseInt(get().requests[0]?.id || '0') + 1).padStart(3, '0');
    set((s) => ({ requests: [{ ...data, id }, ...s.requests] }));
  },

  updateRequestStatus: (id, status, assignee) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id ? { ...r, status, assignee: assignee ?? r.assignee } : r
      ),
    })),
}));