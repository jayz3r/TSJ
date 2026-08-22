"use client";

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
import {
  formatCurrency,
  formatDate,
  EXPENSE_CATEGORY_LABELS,
} from "@/lib/utils";
import type { ExpenseCategory } from "@/types";

interface ExpenseForm {
  category: ExpenseCategory;
  amount: number;
  description: string;
  contractor?: string;
  date: string;
}

const categoryBadgeVariant: Record<
  string,
  "blue" | "amber" | "gray" | "green" | "red"
> = {
  cleaning: "blue",
  repair: "amber",
  electrical: "green",
  security: "red",
  other: "gray",
};

export default function ExpensesPage() {
  const expenses = useAppStore((s) => s.expenses);
  const addExpense = useAppStore((s) => s.addExpense);
  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset } = useForm<ExpenseForm>({
    defaultValues: { category: "cleaning", date: today },
  });

  const onSubmit = (data: ExpenseForm) => {
    addExpense({ ...data, amount: Number(data.amount), hasDocuments: false });
    reset({ category: "cleaning", date: today });
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <PageHeader title="Расходы" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Форма */}
        <Card>
          <CardHeader title="Добавить расход" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormSelect label="Категория" {...register("category")}>
                {Object.entries(EXPENSE_CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </FormSelect>

              <FormInput
                label="Сумма (сом)"
                type="number"
                placeholder="5000"
                {...register("amount", { required: true, min: 1 })}
              />
            </div>

            <FormInput
              label="Описание"
              placeholder="Замена лампочек в подъезде №2"
              {...register("description", { required: true })}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Дата"
                type="date"
                {...register("date", { required: true })}
              />
              <FormInput
                label="Исполнитель"
                placeholder="ООО «РемСервис»"
                {...register("contractor")}
              />
            </div>

            {/* Загрузка документов */}
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-500 mb-1.5">
                Документы
              </p>
              <label className="flex flex-col items-center gap-1.5 border border-dashed border-stone-300 rounded-lg p-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors">
                <span className="text-xl">📎</span>
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  Чек, договор, фото
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              + Добавить расход
            </Button>
          </form>
        </Card>

        {/* Список расходов */}
        <Card>
          <CardHeader title="Расходы (текущий период)" />

          {/* Desktop / tablet: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 dark:bg-stone-800/60 dark:border-stone-800">
                  {["Категория", "Сумма", "Описание", "Дата", "Докум."].map((h) => (
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
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/60">
                    <td className="px-4 py-2.5">
                      <Badge variant={categoryBadgeVariant[e.category]}>
                        {EXPENSE_CATEGORY_LABELS[e.category]}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono font-medium text-stone-900 dark:text-stone-100">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-stone-500 dark:text-stone-500 text-xs max-w-32 truncate">
                      {e.description}
                    </td>
                    <td className="px-4 py-2.5 text-stone-400 dark:text-stone-500 text-xs">
                      {formatDate(e.date)}
                    </td>
                    <td className="px-4 py-2.5 text-stone-400 dark:text-stone-500">
                      {e.hasDocuments ? "📎" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards, no scroll needed */}
          <div className="md:hidden divide-y divide-stone-50">
            {expenses.map((e) => (
              <div key={e.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant={categoryBadgeVariant[e.category]}>
                    {EXPENSE_CATEGORY_LABELS[e.category]}
                  </Badge>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-100">
                    {formatCurrency(e.amount)}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-500">{e.description}</p>
                <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
                  <span>{formatDate(e.date)}</span>
                  <span>{e.hasDocuments ? "📎 Документы" : "Без документов"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div className="px-4 py-3 border-t border-stone-100 flex justify-between text-sm">
            <span className="text-stone-400 dark:text-stone-500">Итого</span>
            <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
              {formatCurrency(total)}
            </span>
          </div>
        </Card>

      </div>
    </div>
  );
}
