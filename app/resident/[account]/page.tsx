'use client';

import { useParams } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';

export default function ResidentOverviewPage() {
  const { account } = useParams<{ account: string }>();
  const apartments  = useAppStore((s) => s.apartments);

  // Фильтруем ТОЛЬКО свою квартиру по accountNumber
  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );
  if (!apt) return null;

  const hasDebt = apt.debt > 0;

  return (
    <div className="space-y-4">
      {/* Баланс — крупная витринная карточка */}
      <div className={`rounded-2xl p-5 text-white shadow-lg ${
        hasDebt
          ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-900/10'
          : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-900/10'
      }`}>
        <p className="text-xs font-medium uppercase tracking-wide text-white/70 mb-1">Текущий баланс</p>
        <p className="text-3xl font-semibold font-mono tracking-tight">
          {apt.balance > 0 ? '+' : ''}{formatCurrency(apt.balance)}
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-sm">
          <span>{hasDebt ? '⚠️' : '✅'}</span>
          <span className="font-medium">
            {hasDebt ? `Задолженность ${formatCurrency(apt.debt)}` : 'Задолженности нет'}
          </span>
        </div>
        {hasDebt && (
          <p className="text-xs text-white/70 mt-1">Обратитесь к председателю для оплаты</p>
        )}
      </div>

      {/* Карточки — только данные этой квартиры */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-4 col-span-2 flex items-center gap-3 dark:bg-stone-900 dark:border-stone-800">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-base">
            🏠
          </div>
          <div>
            <p className="text-xs text-stone-400 dark:text-stone-500">Лицевой счёт</p>
            <p className="text-base font-semibold font-mono text-stone-900 dark:text-stone-100 tracking-wide">
              {apt.accountNumber}
            </p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 dark:bg-stone-900 dark:border-stone-800">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-sm mb-2">
            📐
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">Площадь</p>
          <p className="text-base font-semibold text-stone-900 dark:text-stone-100">{apt.area} м²</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 dark:bg-stone-900 dark:border-stone-800">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-sm mb-2">
            💵
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">Взнос / мес.</p>
          <p className="text-base font-semibold font-mono text-stone-900 dark:text-stone-100">
            {formatCurrency(apt.monthlyFee)}
          </p>
        </div>
      </div>

      {/* Контакты ТСЖ */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2.5 dark:bg-stone-900 dark:border-stone-800">
        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">ТСЖ «Весна»</p>
        <div className="space-y-1.5 text-sm text-stone-500 dark:text-stone-500">
          <p className="flex items-center gap-2"><span>📍</span> ул. Ленина, 12</p>
          <p className="flex items-center gap-2"><span>📞</span> +996 312 00-00-00</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 ml-6">Пн–Пт, 9:00–18:00</p>
        </div>
      </div>
    </div>
  );
}