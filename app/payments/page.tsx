"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/store/app-store";
import {
  Card,
  CardHeader,
  Badge,
  Button,
  FormInput,
  FormSelect,
  PageHeader,
} from "@/components/ui";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Payment } from "@/types";

interface PaymentForm {
  apartmentId: string;
  amount: number;
  method: "cash" | "bank";
  date: string;
  note?: string;
}

export default function PaymentsPage() {
  const apartments = useAppStore((s) => s.apartments);
  const payments = useAppStore((s) => s.payments);
  const addPayment = useAppStore((s) => s.addPayment);
  const [receipt, setReceipt] = useState<Payment | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PaymentForm>({
    defaultValues: { date: today, method: "cash" },
  });

  const selectedAptId = watch("apartmentId");
  const selectedApt = apartments.find((a) => a.id === selectedAptId);

  const onSubmit = (data: PaymentForm) => {
    const apt = apartments.find((a) => a.id === data.apartmentId)!;
    const payment = addPayment({
      apartmentId: data.apartmentId,
      apartmentNumber: apt.number,
      ownerName: apt.ownerName,
      amount: Number(data.amount),
      method: data.method,
      date: data.date,
      note: data.note,
    });
    setReceipt(payment);
    reset({ date: today, method: "cash" });
  };

  return (
    <div>
      <PageHeader title="Платежи" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Форма */}
        <Card>
          <CardHeader title="Принять платёж" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            <FormSelect
              label="Квартира"
              {...register("apartmentId", { required: true })}
            >
              <option value="">— выберите квартиру —</option>
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>
                  кв. {a.number} — {a.ownerName}
                  {a.debt > 0 ? ` (долг ${formatCurrency(a.debt)})` : ""}
                </option>
              ))}
            </FormSelect>

            {selectedApt && selectedApt.debt > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                ⚠ Текущий долг: {formatCurrency(selectedApt.debt)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Сумма (сом)"
                type="number"
                placeholder={
                  selectedApt ? String(selectedApt.monthlyFee) : "2400"
                }
                {...register("amount", { required: true, min: 1 })}
              />
              <FormSelect label="Способ" {...register("method")}>
                <option value="cash">Наличные</option>
                <option value="bank">Банк (перевод)</option>
              </FormSelect>
            </div>

            <FormInput
              label="Дата"
              type="date"
              {...register("date", { required: true })}
            />

            <FormInput
              label="Примечание"
              placeholder="Оплата за май 2025"
              {...register("note")}
            />

            {errors.apartmentId && (
              <p className="text-xs text-red-500">Выберите квартиру</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              ✓ Провести платёж + ПКО
            </Button>
          </form>
        </Card>

        {/* Список платежей */}
        <Card>
          <CardHeader title="Последние платежи" />

          {/* Карточки на мобиле/планшете */}
          <div className="md:hidden divide-y divide-stone-100 dark:divide-stone-800">
            {payments.slice(0, 10).map((p) => (
              <button
                key={p.id}
                onClick={() => setReceipt(p)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {p.apartmentNumber}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">кв. {p.apartmentNumber}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{formatShortDate(p.date)} · 🖨 ПКО</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(p.amount)}</p>
                  <div className="mt-1 flex justify-end">
                    <Badge variant={p.method === "bank" ? "blue" : "gray"}>
                      {p.method === "bank" ? "Банк" : "Нал."}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Таблица на десктопе */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 dark:bg-stone-800/60 dark:border-stone-800">
                  {["Кв.", "Сумма", "Дата", "Способ", "ПКО"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {payments.slice(0, 10).map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/60">
                    <td className="px-4 py-2.5 font-medium text-stone-700 dark:text-stone-300">
                      кв. {p.apartmentNumber}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-stone-900 dark:text-stone-100">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-stone-500 dark:text-stone-500">
                      {formatShortDate(p.date)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={p.method === "bank" ? "blue" : "gray"}>
                        {p.method === "bank" ? "Банк" : "Нал."}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setReceipt(p)}
                        className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        🖨 ПКО
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Модалка ПКО */}
      {receipt && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setReceipt(null)}
        >
          <div
            className="bg-white rounded-xl border border-stone-200 p-6 w-80 shadow-xl dark:bg-stone-900 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Приходный кассовый ордер
                </h2>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                  ТСЖ «Весна» · ул. Ленина, 12
                </p>
              </div>
              <button
                onClick={() => setReceipt(null)}
                className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 border-t border-stone-100 pt-3">
              {[
                ["Номер", receipt.receiptNumber],
                ["Квартира", `кв. ${receipt.apartmentNumber}`],
                ["Плательщик", receipt.ownerName],
                ["Дата", receipt.date],
                [
                  "Способ",
                  receipt.method === "bank" ? "Банк (перевод)" : "Наличные",
                ],
                ["Назначение", "Взносы ТСЖ"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between text-sm border-b border-stone-50 pb-2"
                >
                  <span className="text-stone-400 dark:text-stone-500">{label}</span>
                  <span className="text-stone-800 dark:text-stone-200 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-1">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Итого</span>
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(receipt.amount)}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                className="justify-center"
                onClick={() => window.print()}
              >
                🖨 Печать
              </Button>
              <Button
                variant="secondary"
                className="justify-center"
                onClick={() => setReceipt(null)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
