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
import { formatCurrency } from "@/lib/utils";

interface AccrualForm {
  period: string;
  type: string;
  ratePerSqm: number;
  applyTo: "all" | "manual";
}

const PERIODS = ["Июнь 2025", "Июль 2025", "Август 2025"];
const TYPES = [
  "Взнос на содержание",
  "Коммунальные услуги",
  "Дополнительный сбор",
];
const TOTAL_AREA = 2184;

export default function AccrualsPage() {
  const accruals = useAppStore((s) => s.accruals);
  const apartments = useAppStore((s) => s.apartments);
  const addAccrual = useAppStore((s) => s.addAccrual);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<AccrualForm>({
    defaultValues: {
      period: PERIODS[0],
      type: TYPES[0],
      ratePerSqm: 57,
      applyTo: "all",
    },
  });

  const rate = Number(watch("ratePerSqm")) || 0;
  const total = Math.round(rate * TOTAL_AREA);

  const onSubmit = (data: AccrualForm) => {
    addAccrual({
      period: data.period,
      totalAmount: total,
      apartments: apartments.length,
      type: data.type,
      status: "applied",
    });
    setSuccess(true);
    reset({
      period: PERIODS[0],
      type: TYPES[0],
      ratePerSqm: 57,
      applyTo: "all",
    });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Начисления" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Форма */}
        <Card>
          <CardHeader title="Создать начисление" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormSelect label="Период" {...register("period")}>
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </FormSelect>

              <FormSelect label="Применить к" {...register("applyTo")}>
                <option value="all">Всем ({apartments.length} кв.)</option>
                <option value="manual">Выбрать вручную</option>
              </FormSelect>
            </div>

            <FormSelect label="Тип начисления" {...register("type")}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </FormSelect>

            <FormInput
              label="Ставка (сом/м²)"
              type="number"
              step="0.1"
              {...register("ratePerSqm")}
            />

            {/* Итого */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 dark:bg-stone-900/60 dark:border-stone-800">
              <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mb-1">
                <span>Общая площадь: {TOTAL_AREA.toLocaleString("ru")} м²</span>
                <span>{apartments.length} квартир</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-400 font-medium">
                  Итого к начислению
                </span>
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700">
                ✓ Начисление успешно создано
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              ⚡ Начислить всем
            </Button>
          </form>
        </Card>

        {/* История */}
        <Card>
          <CardHeader title="История начислений" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-150">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 dark:bg-stone-800/60 dark:border-stone-800">
                  {["Период", "Сумма", "Тип", "Квартир", "Статус"].map((h) => (
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
                {accruals.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/60">
                    <td className="px-4 py-2.5 font-medium text-stone-800 dark:text-stone-200">
                      {a.period}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-stone-900 dark:text-stone-100">
                      {formatCurrency(a.totalAmount)}
                    </td>
                    <td className="px-4 py-2.5 text-stone-500 dark:text-stone-500 text-xs">
                      {a.type}
                    </td>
                    <td className="px-4 py-2.5 text-stone-500 dark:text-stone-500">
                      {a.apartments}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={a.status === "applied" ? "green" : "amber"}
                      >
                        {a.status === "applied" ? "Применено" : "Ожидание"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
