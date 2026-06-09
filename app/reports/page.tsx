'use client';

import { useState } from 'react';
import { Card, CardHeader, Button, PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { mockStats, mockExpenses, mockAccruals } from '@/lib/mock-data';

const PERIODS = ['Май 2025', 'Апрель 2025', 'Март 2025', '2025 год'];

export default function ReportsPage() {
  const [period, setPeriod] = useState(PERIODS[0]);
  const [type,   setType]   = useState('monthly');

  const income   = mockStats.monthlyIncome;
  const expenses = mockExpenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = income - expenses;
  const planned   = mockAccruals[0]?.totalAmount ?? 0;
  const collectionRate = Math.round((income / planned) * 100);

  const rows = [
    { label: 'Начислено (план)', value: formatCurrency(planned),   note: 'план',               bold: false                        },
    { label: 'Собрано',          value: formatCurrency(income),    note: `${collectionRate}% от плана`, bold: false, warn: collectionRate < 80 },
    { label: 'Расходы',          value: formatCurrency(expenses),  note: `${mockExpenses.length} статьи`, bold: false                   },
    { label: 'Чистый доход',     value: formatCurrency(netIncome), note: '+18% к апрелю',       bold: true,  positive: true             },
    { label: 'Общий баланс',     value: formatCurrency(mockStats.balance), note: 'нарастающим итогом', bold: true                    },
  ];

  return (
    <div>
      <PageHeader title="Отчёты" />

      {/* Параметры */}
      <Card className="mb-4">
        <CardHeader title="Параметры отчёта" />
        <div className="p-5 flex gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500">Тип</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="monthly">Ежемесячный</option>
              <option value="yearly">Годовой</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-500">Период</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
            >
              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Button variant="primary" onClick={() => window.print()}>
            📄 Экспорт PDF
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Сводная таблица */}
        <Card>
          <CardHeader title={`Отчёт: ${period}`} />
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Показатель', 'Сумма', 'Комментарий'].map((h) => (
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
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-stone-50">
                  <td className={`px-4 py-3 ${row.bold ? 'font-semibold text-stone-900' : 'text-stone-600'}`}>
                    {row.label}
                  </td>
                  <td className={`px-4 py-3 font-mono font-semibold ${
                    'positive' in row && row.positive
                      ? 'text-emerald-600'
                      : row.bold
                      ? 'text-stone-900'
                      : 'text-stone-800'
                  }`}>
                    {row.value}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${'warn' in row && row.warn ? 'text-amber-600 font-medium' : 'text-stone-400'}`}>
                      {row.note}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Структура расходов */}
        <Card>
          <CardHeader title="Структура расходов" />
          <div className="p-5 space-y-4">
            {mockExpenses.map((e) => {
              const pct = Math.round((e.amount / expenses) * 100);
              return (
                <div key={e.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-600">{e.description}</span>
                    <span className="font-mono text-stone-800">
                      {formatCurrency(e.amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full">
                    <div
                      className="h-1.5 bg-emerald-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}