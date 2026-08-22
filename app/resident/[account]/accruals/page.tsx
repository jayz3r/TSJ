'use client';

import { useParams } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';

export default function ResidentAccrualsPage() {
  const { account } = useParams<{ account: string }>();
  const apartments  = useAppStore((s) => s.apartments);
  const accruals    = useAppStore((s) => s.accruals);

  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );
  if (!apt) return null;

  // Показываем начисления с суммой ТОЛЬКО этой квартиры
  const myMonthlyFee = apt.monthlyFee;
  const totalAccrued = myMonthlyFee * accruals.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Начисления</h2>
        <span className="text-xs text-stone-400 dark:text-stone-500">{accruals.length} периодов</span>
      </div>

      {/* Инфо о тарифе */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex justify-between items-center">
        <div>
          <p className="text-xs text-emerald-600 font-medium">Ваш ежемесячный взнос</p>
          <p className="text-xs text-emerald-500 mt-0.5">{apt.area} м² × тариф</p>
        </div>
        <p className="font-mono font-semibold text-emerald-700 text-base">
          {formatCurrency(myMonthlyFee)}
        </p>
      </div>

      <div className="space-y-2">
        {accruals.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex items-center justify-between dark:bg-stone-900 dark:border-stone-800"
          >
            <div>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{a.period}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{a.type}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-stone-900 dark:text-stone-100 text-sm">
                {formatCurrency(myMonthlyFee)}
              </p>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Начислено
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex justify-between items-center dark:bg-stone-900/60 dark:border-stone-800">
        <span className="text-sm text-stone-500 dark:text-stone-500">Итого начислено</span>
        <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
          {formatCurrency(totalAccrued)}
        </span>
      </div>
    </div>
  );
}