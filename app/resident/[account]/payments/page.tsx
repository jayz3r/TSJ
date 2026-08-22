'use client';

import { useParams } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ResidentPaymentsPage() {
  const { account } = useParams<{ account: string }>();
  const apartments  = useAppStore((s) => s.apartments);
  const payments    = useAppStore((s) => s.payments);

  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );
  if (!apt) return null;

  // Только платежи этой квартиры — фильтр по apt.id
  const myPayments = payments
    .filter((p) => p.apartmentId === apt.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = myPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">История платежей</h2>
        {myPayments.length > 0 && (
          <span className="text-xs text-stone-400 dark:text-stone-500">{myPayments.length} записей</span>
        )}
      </div>

      {myPayments.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-10 text-center dark:bg-stone-900 dark:border-stone-800">
          <p className="text-2xl mb-2">💳</p>
          <p className="text-sm text-stone-400 dark:text-stone-500">Платежей пока нет</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex items-center justify-between dark:bg-stone-900 dark:border-stone-800"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    {formatDate(p.date)}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-stone-400 dark:text-stone-500">
                      {p.method === 'bank' ? '🏦 Банк' : '💵 Наличные'}
                    </span>
                    <span className="text-xs text-stone-300">·</span>
                    <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
                      {p.receiptNumber}
                    </span>
                  </div>
                </div>
                <p className="font-mono font-semibold text-emerald-600 text-sm">
                  +{formatCurrency(p.amount)}
                </p>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex justify-between items-center dark:bg-stone-900/60 dark:border-stone-800">
            <span className="text-sm text-stone-500 dark:text-stone-500">Итого оплачено</span>
            <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
              {formatCurrency(total)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}