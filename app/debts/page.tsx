import {
  MetricCard,
  Card,
  CardHeader,
  Badge,
  Button,
  PageHeader,
} from "@/components/ui";
import { mockDebtors } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DebtsPage() {
  const debtors = mockDebtors;
  const totalDebt = debtors.reduce((s, d) => s + d.debt, 0);
  const criticalCount = debtors.filter((d) => d.monthsOverdue >= 3).length;

  return (
    <div>
      <PageHeader title="Долги" />

      {/* Метрики */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <MetricCard
          label="Всего должников"
          value={String(debtors.length)}
          valueColor="red"
        />
        <MetricCard
          label="Общий долг"
          value={formatCurrency(totalDebt)}
          valueColor="red"
        />
        <MetricCard
          label="Критических (≥3 мес.)"
          value={String(criticalCount)}
          valueColor="amber"
        />
      </div>

      <Card>
        <CardHeader title="Список должников" />

        {/* Карточки на мобиле/планшете */}
        <div className="md:hidden p-3 space-y-2.5">
          {debtors
            .sort((a, b) => b.monthsOverdue - a.monthsOverdue)
            .map((d) => {
              const critical = d.monthsOverdue >= 3;
              return (
                <div
                  key={d.apartmentId}
                  className={`rounded-xl border-l-[3px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden ${
                    critical ? "border-l-red-500" : "border-l-amber-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 px-3.5 pt-3">
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-xs font-semibold text-red-700 dark:text-red-400">
                        {d.apartmentNumber}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                          кв. {d.apartmentNumber}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {d.ownerName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={critical ? "red" : "amber"}>
                      {d.monthsOverdue} мес. просрочки
                    </Badge>
                  </div>

                  <div className="flex items-end justify-between gap-3 px-3.5 pt-2.5 pb-3 mt-1">
                    <div>
                      <p className="text-xs text-stone-400 dark:text-stone-500">Долг</p>
                      <p className="font-mono text-lg font-semibold text-red-600 dark:text-red-400 leading-tight">
                        {formatCurrency(d.debt)}
                      </p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                        Посл. платёж: {d.lastPayment}
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" className="shrink-0">
                      ✉ Уведомить
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Таблица на десктопе */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 dark:bg-stone-800/60 dark:border-stone-800">
                {[
                  "Кв.",
                  "Владелец",
                  "Долг",
                  "Мес. просрочки",
                  "Последний платёж",
                  "Действие",
                ].map((h) => (
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
              {debtors
                .sort((a, b) => b.monthsOverdue - a.monthsOverdue)
                .map((d) => (
                  <tr
                    key={d.apartmentId}
                    className={`hover:bg-stone-50 dark:hover:bg-stone-800/60 ${
                      d.monthsOverdue >= 3 ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-stone-800 dark:text-stone-200">
                      кв. {d.apartmentNumber}
                    </td>
                    <td className="px-4 py-2.5 text-stone-700 dark:text-stone-300">
                      {d.ownerName}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-red-600">
                      {formatCurrency(d.debt)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={d.monthsOverdue >= 3 ? "red" : "amber"}>
                        {d.monthsOverdue} мес.
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-stone-400 dark:text-stone-500">
                      {d.lastPayment}
                    </td>
                    <td className="px-4 py-2.5">
                      <Button size="sm" variant="secondary">
                        ✉ Уведомить
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}