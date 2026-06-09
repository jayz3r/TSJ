'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/app-store';
import { Card, CardHeader, Badge, MetricCard } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const apartments = useAppStore((s) => s.apartments);
  const payments   = useAppStore((s) => s.payments);
  const accruals   = useAppStore((s) => s.accruals);

  const apt = apartments.find((a) => a.id === id);
  if (!apt) return <p className="text-sm text-stone-400">Квартира не найдена.</p>;

  const aptPayments = payments.filter((p) => p.apartmentId === id);

  return (
    <div>
      <div className="mb-5">
        <Link href="/apartments" className="text-sm text-stone-400 hover:text-stone-700">
          ← Квартиры
        </Link>
        <h1 className="text-lg font-semibold text-stone-900 mt-1">
          Квартира №{apt.number}
        </h1>
        <p className="text-sm text-stone-400">{apt.ownerName}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <MetricCard label="Площадь" value={`${apt.area} м²`} />
        <MetricCard
          label="Текущий баланс"
          value={formatCurrency(apt.balance)}
          valueColor={apt.balance < 0 ? 'red' : apt.balance > 0 ? 'green' : 'default'}
        />
        <MetricCard
          label="Долг"
          value={formatCurrency(apt.debt)}
          valueColor={apt.debt > 0 ? 'red' : 'default'}
        />
        <MetricCard label="Взнос/мес." value={formatCurrency(apt.monthlyFee)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* История платежей */}
        <Card>
          <CardHeader title="История платежей" />
          {aptPayments.length === 0 ? (
            <p className="text-center py-8 text-sm text-stone-400">Платежей нет</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  {['Дата', 'Сумма', 'Способ', 'Квитанция'].map((h) => (
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
                {aptPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2.5 text-stone-500">{formatDate(p.date)}</td>
                    <td className="px-4 py-2.5 font-mono font-medium text-stone-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={p.method === 'bank' ? 'blue' : 'gray'}>
                        {p.method === 'bank' ? 'Банк' : 'Нал.'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-stone-400">
                      {p.receiptNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Начисления */}
        <Card>
          <CardHeader title="Начисления" />
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Период', 'Сумма', 'Статус'].map((h) => (
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
              {accruals.map((a) => (
                <tr key={a.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5 text-stone-700">{a.period}</td>
                  <td className="px-4 py-2.5 font-mono text-stone-900">
                    {formatCurrency(apt.monthlyFee)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="green">Начислено</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}