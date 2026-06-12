'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/app-store';
import { Card, CardHeader, Badge, PageHeader, Button, FormInput } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface ApartmentForm {
  number: number;
  area: number;
  ownerName: string;
  phone?: string;
  monthlyFee: number;
}

export default function ApartmentsPage() {
  const apartments  = useAppStore((s) => s.apartments);
  const addApartment = useAppStore((s) => s.addApartment);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApartmentForm>();

  const onSubmit = (data: ApartmentForm) => {
    addApartment({
      number:     Number(data.number),
      area:       Number(data.area),
      ownerName:  data.ownerName,
      phone:      data.phone,
      monthlyFee: Number(data.monthlyFee),
    });
    reset();
    setShowForm(false);
  };

  const filtered = apartments.filter(
    (a) =>
      a.number.toString().includes(search) ||
      a.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Квартиры"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            + Добавить квартиру
          </Button>
        }
      />

      {/* Форма добавления квартиры */}
      {showForm && (
        <Card className="mb-4">
          <CardHeader title="Новая квартира" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <FormInput
                label="Номер квартиры"
                type="number"
                placeholder="25"
                {...register('number', { required: true, min: 1 })}
              />
              <FormInput
                label="Площадь (м²)"
                type="number"
                placeholder="45"
                {...register('area', { required: true, min: 1 })}
              />
              <FormInput
                label="Владелец"
                placeholder="Иванов И.И."
                {...register('ownerName', { required: true })}
              />
              <FormInput
                label="Телефон"
                placeholder="+996 700 123-456"
                {...register('phone')}
              />
              <FormInput
                label="Взнос/мес. (сом)"
                type="number"
                placeholder="2400"
                {...register('monthlyFee', { required: true, min: 1 })}
              />
            </div>

            {(errors.number || errors.area || errors.ownerName || errors.monthlyFee) && (
              <p className="text-xs text-red-500 mb-3">Заполните все обязательные поля</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" variant="primary">Добавить</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Отмена</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader
          title={`Все квартиры (${apartments.length})`}
          action={
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500 w-32 sm:w-52 placeholder:text-stone-300"
            />
          }
        />

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
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
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-stone-50">
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
              <Link
                key={apt.id}
                href={`/apartments/${apt.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-stone-50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-stone-800 text-sm">кв. {apt.number}</span>
                    <span className="text-xs text-stone-400">{apt.area} м²</span>
                  </div>
                  <p className="text-sm text-stone-600">{apt.ownerName}</p>
                  <div className="mt-1.5">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p
                    className={`font-mono font-medium text-sm ${
                      apt.balance < 0
                        ? 'text-red-600'
                        : apt.balance > 0
                        ? 'text-emerald-600'
                        : 'text-stone-500'
                    }`}
                  >
                    {apt.balance > 0 ? '+' : ''}
                    {formatCurrency(apt.balance)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{formatCurrency(apt.monthlyFee)}/мес.</p>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm text-stone-400">Ничего не найдено</p>
        )}
      </Card>
    </div>
  );
}