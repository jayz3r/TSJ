'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app-store';
import { Card, CardHeader, Badge, PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function ApartmentsPage() {
  const apartments = useAppStore((s) => s.apartments);
  const [search, setSearch] = useState('');

  const filtered = apartments.filter(
    (a) =>
      a.number.toString().includes(search) ||
      a.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Квартиры" />

      <Card>
        <CardHeader
          title={`Все квартиры (${apartments.length})`}
          action={
            <input
              type="text"
              placeholder="Поиск по № или владельцу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500 w-52 placeholder:text-stone-300"
            />
          }
        />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['№', 'Площадь', 'Владелец', 'Телефон', 'Взнос/мес.', 'Баланс', 'Статус', ''].map((h) => (
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
            {filtered.map((apt) => {
              const statusVariant =
                apt.balance > 0
                  ? 'blue'
                  : apt.debt === 0
                  ? 'green'
                  : apt.debt > apt.monthlyFee
                  ? 'red'
                  : 'amber';

              const statusLabel =
                apt.balance > 0
                  ? 'Переплата'
                  : apt.debt === 0
                  ? 'Оплачено'
                  : `Долг ${Math.round(apt.debt / apt.monthlyFee)} мес.`;

              return (
                <tr key={apt.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5 font-semibold text-stone-800">
                    кв. {apt.number}
                  </td>
                  <td className="px-4 py-2.5 text-stone-500">{apt.area} м²</td>
                  <td className="px-4 py-2.5 text-stone-800">{apt.ownerName}</td>
                  <td className="px-4 py-2.5 text-stone-400 font-mono text-xs">
                    {apt.phone ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-stone-700">
                    {formatCurrency(apt.monthlyFee)}
                  </td>
                  <td
                    className={`px-4 py-2.5 font-mono font-medium ${
                      apt.balance < 0
                        ? 'text-red-600'
                        : apt.balance > 0
                        ? 'text-emerald-600'
                        : 'text-stone-500'
                    }`}
                  >
                    {apt.balance > 0 ? '+' : ''}
                    {formatCurrency(apt.balance)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/apartments/${apt.id}`}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      Подробнее →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm text-stone-400">Ничего не найдено</p>
        )}
      </Card>
    </div>
  );
}