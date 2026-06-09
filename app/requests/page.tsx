'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/app-store';
import { Card, CardHeader, Badge, Button, FormInput, PageHeader } from '@/components/ui';
import { formatDate, REQUEST_STATUS_LABELS } from '@/lib/utils';
import type { RequestStatus } from '@/types';

interface RequestForm {
  apartmentNumber: number;
  subject: string;
  date: string;
}

const statusVariant: Record<RequestStatus, 'red' | 'amber' | 'green'> = {
  new:         'red',
  in_progress: 'amber',
  completed:   'green',
};

export default function RequestsPage() {
  const requests             = useAppStore((s) => s.requests);
  const addRequest           = useAppStore((s) => s.addRequest);
  const updateRequestStatus  = useAppStore((s) => s.updateRequestStatus);
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, reset } = useForm<RequestForm>({
    defaultValues: { date: today },
  });

  const onSubmit = (data: RequestForm) => {
    addRequest({ ...data, apartmentNumber: Number(data.apartmentNumber), status: 'new' });
    reset({ date: today });
    setShowForm(false);
  };

  const counts = { new: 0, in_progress: 0, completed: 0 };
  requests.forEach((r) => counts[r.status]++);

  return (
    <div>
      <PageHeader
        title="Заявки"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            + Новая заявка
          </Button>
        }
      />

      {/* Счётчики */}
      <div className="flex gap-3 mb-4">
        {[
          { label: 'Новых',    count: counts.new,         color: 'text-red-600'     },
          { label: 'В работе', count: counts.in_progress, color: 'text-amber-600'   },
          { label: 'Готово',   count: counts.completed,   color: 'text-emerald-600' },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 flex items-center gap-3"
          >
            <span className={`text-2xl font-semibold font-mono ${color}`}>{count}</span>
            <span className="text-xs text-stone-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Форма новой заявки */}
      {showForm && (
        <Card className="mb-4">
          <CardHeader title="Новая заявка" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <FormInput
                label="Квартира №"
                type="number"
                placeholder="14"
                {...register('apartmentNumber', { required: true })}
              />
              <div className="col-span-2">
                <FormInput
                  label="Тема заявки"
                  placeholder="Течёт труба в подъезде"
                  {...register('subject', { required: true })}
                />
              </div>
              <FormInput
                label="Дата"
                type="date"
                {...register('date', { required: true })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">Добавить</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Отмена</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader title={`Все заявки (${requests.length})`} />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['№', 'Кв.', 'Тема', 'Дата', 'Статус', 'Исполнитель', 'Действие'].map((h) => (
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
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5 font-mono text-xs text-stone-400">#{r.id}</td>
                <td className="px-4 py-2.5 font-medium text-stone-700">кв. {r.apartmentNumber}</td>
                <td className="px-4 py-2.5 text-stone-800">{r.subject}</td>
                <td className="px-4 py-2.5 text-stone-400 text-xs">{formatDate(r.date)}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={statusVariant[r.status]}>
                    {REQUEST_STATUS_LABELS[r.status]}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-stone-400 text-xs">{r.assignee ?? '—'}</td>
                <td className="px-4 py-2.5">
                  {r.status !== 'completed' && (
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateRequestStatus(r.id, e.target.value as RequestStatus)
                      }
                      className="text-xs border border-stone-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Выполнено</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}