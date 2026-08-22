'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/app-store';
import { formatDate } from '@/lib/utils';

interface RequestForm {
  subject: string;
}

const statusConfig: Record<string, { label: string; style: string; icon: string }> = {
  new:         { label: 'Новая',    style: 'bg-red-50 text-red-700 border-red-200',         icon: '🔴' },
  in_progress: { label: 'В работе', style: 'bg-amber-50 text-amber-700 border-amber-200',   icon: '🟡' },
  completed:   { label: 'Готово',   style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🟢' },
};

export default function ResidentRequestsPage() {
  const { account } = useParams<{ account: string }>();
  const apartments  = useAppStore((s) => s.apartments);
  const requests    = useAppStore((s) => s.requests);
  const addRequest  = useAppStore((s) => s.addRequest);
  const [showForm, setShowForm] = useState(false);

  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );
  if (!apt) return null;

  // Только заявки этой квартиры — фильтр по apt.number
  const myRequests = requests
    .filter((r) => r.apartmentNumber === apt.number)
    .sort((a, b) => b.id.localeCompare(a.id));

  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestForm>();

  const onSubmit = (data: RequestForm) => {
    addRequest({
      apartmentNumber: apt.number,
      subject:         data.subject,
      date:            today,
      status:          'new',
    });
    reset();
    setShowForm(false);
  };

  const counts = {
    new:         myRequests.filter((r) => r.status === 'new').length,
    in_progress: myRequests.filter((r) => r.status === 'in_progress').length,
    completed:   myRequests.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Мои заявки</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          + Новая заявка
        </button>
      </div>

      {/* Счётчики статусов */}
      {myRequests.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Новых',    count: counts.new,         color: 'text-red-600'     },
            { label: 'В работе', count: counts.in_progress, color: 'text-amber-600'   },
            { label: 'Готово',   count: counts.completed,   color: 'text-emerald-600' },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white border border-stone-200 rounded-xl p-3 text-center dark:bg-stone-900 dark:border-stone-800">
              <p className={`text-xl font-semibold font-mono ${color}`}>{count}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Форма */}
      {showForm && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 dark:bg-stone-900 dark:border-stone-800">
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-3">Новая заявка</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Опишите проблему подробно..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-300 resize-none"
              {...register('subject', { required: true })}
            />
            {errors.subject && (
              <p className="text-xs text-red-500">Опишите проблему</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Отправить
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); reset(); }}
                className="text-xs border border-stone-200 text-stone-600 dark:text-stone-400 px-4 py-2 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список */}
      {myRequests.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-10 text-center dark:bg-stone-900 dark:border-stone-800">
          <p className="text-2xl mb-2">🔧</p>
          <p className="text-sm text-stone-400 dark:text-stone-500">Заявок пока нет</p>
          <p className="text-xs text-stone-300 mt-1">Нажмите «+ Новая заявка»</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myRequests.map((r) => {
            const cfg = statusConfig[r.status];
            return (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 dark:bg-stone-900 dark:border-stone-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-stone-800 dark:text-stone-200 flex-1 leading-snug">{r.subject}</p>
                  <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 font-medium ${cfg.style}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-400 dark:text-stone-500">
                  <span className="font-mono">#{r.id}</span>
                  <span>{formatDate(r.date)}</span>
                  {r.assignee && (
                    <span className="text-stone-500 dark:text-stone-500">👤 {r.assignee}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}