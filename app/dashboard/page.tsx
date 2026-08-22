import { MetricCard, Card, CardHeader, Badge } from '@/components/ui';
import { mockStats, mockPayments } from '@/lib/mock-data';
import { formatCurrency, formatShortDate } from '@/lib/utils';

const monthlyData = [
  { month: 'Янв', amount: 92000,  pct: 55 },
  { month: 'Фев', amount: 98000,  pct: 60 },
  { month: 'Мар', amount: 108000, pct: 72 },
  { month: 'Апр', amount: 103000, pct: 65 },
  { month: 'Май', amount: 115200, pct: 80 },
];

export default function DashboardPage() {
  const stats = mockStats;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold pt-5">Обзор</h1>
        <p className="text-sm text-stone-400 dark:text-stone-500 mt-0.5">Май 2025</p>
      </div>

      {/* 2 колонки на мобиле, 4 на десктопе */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard
          label="Баланс"
          value={formatCurrency(stats.balance)}
          sub="на счёте"
          valueColor="green"
        />
        <MetricCard
          label="Доход за май"
          value={formatCurrency(stats.monthlyIncome)}
          sub={`${stats.paidApartments} из ${stats.totalApartments}`}
        />
        <MetricCard
          label="Расходы"
          value={formatCurrency(stats.monthlyExpenses)}
          sub="4 операции"
          valueColor="amber"
        />
        <MetricCard
          label="Долг"
          value={formatCurrency(stats.totalDebt)}
          sub="7 должников"
          valueColor="red"
        />
      </div>

      {/* 1 колонка на мобиле, 2 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Последние платежи" />

          {/* Карточки на мобиле/планшете */}
          <div className="md:hidden divide-y divide-stone-100 dark:divide-stone-800">
            {mockPayments.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {p.apartmentNumber}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">кв. {p.apartmentNumber}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{formatShortDate(p.date)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(p.amount)}</p>
                  <div className="mt-1 flex justify-end">
                    <Badge variant={p.method === 'bank' ? 'blue' : 'gray'}>
                      {p.method === 'bank' ? 'Банк' : 'Нал.'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Таблица на десктопе */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-100">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 dark:bg-stone-800/60 dark:border-stone-800">
                  {['Кв.', 'Сумма', 'Дата', 'Способ'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {mockPayments.slice(0, 6).map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/60">
                    <td className="px-4 py-2.5 font-medium text-stone-700 dark:text-stone-300">кв. {p.apartmentNumber}</td>
                    <td className="px-4 py-2.5 font-mono text-stone-900 dark:text-stone-100">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-2.5 text-stone-500 dark:text-stone-500">{formatShortDate(p.date)}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={p.method === 'bank' ? 'blue' : 'gray'}>
                        {p.method === 'bank' ? 'Банк' : 'Нал.'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Сборы по месяцам" />
          <div className="p-5">
            <div className="flex items-end gap-2 h-32 mb-3">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-mono hidden sm:block">
                    {Math.round(d.amount / 1000)}к
                  </span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${d.pct}%`,
                        background: d.month === 'Май' ? '#059669' : '#a7f3d0',
                      }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 dark:text-stone-500">{d.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 border-t border-stone-100 pt-3">
              Плановый сбор: {formatCurrency(115200)} / месяц
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}