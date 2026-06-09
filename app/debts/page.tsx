import { MetricCard, Card, CardHeader, Badge, Button, PageHeader } from '@/components/ui';
import { mockDebtors } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function DebtsPage() {
  const debtors      = mockDebtors;
  const totalDebt    = debtors.reduce((s, d) => s + d.debt, 0);
  const criticalCount = debtors.filter((d) => d.monthsOverdue >= 3).length;

  return (
    <div>
      <PageHeader title="Долги" />

      {/* Метрики */}
      <div className="grid grid-cols-3 gap-3 mb-5">
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
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['Кв.', 'Владелец', 'Долг', 'Мес. просрочки', 'Последний платёж', 'Действие'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium text-stone-400 uppercase tracking-wide"
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
                  className={`hover:bg-stone-50 ${
                    d.monthsOverdue >= 3 ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-semibold text-stone-800">
                    кв. {d.apartmentNumber}
                  </td>
                  <td className="px-4 py-2.5 text-stone-700">{d.ownerName}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-red-600">
                    {formatCurrency(d.debt)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={d.monthsOverdue >= 3 ? 'red' : 'amber'}>
                      {d.monthsOverdue} мес.
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-stone-400">{d.lastPayment}</td>
                  <td className="px-4 py-2.5">
                    <Button size="sm" variant="secondary">
                      ✉ Уведомить
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}