'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';
import { THEME_COOKIE_NAME, type Theme } from '@/lib/theme';
import { ROLE_COOKIE_NAME, ACCOUNT_COOKIE_NAME } from '@/lib/role';
import { Card, CardHeader, Button, Switch, FormInput } from '@/components/ui';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function ResidentSettingsPage() {
  const { account } = useParams<{ account: string }>();
  const router = useRouter();
  const apartments = useAppStore((s) => s.apartments);
  const updateApartmentContact = useAppStore((s) => s.updateApartmentContact);

  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );

  const [theme, setTheme] = useState<Theme>('light');
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(apt?.phone ?? '');
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifRequests, setNotifRequests] = useState(true);
  const [notifNews, setNotifNews] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  if (!apt) return null;

  const applyTheme = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.cookie = `${THEME_COOKIE_NAME}=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  const savePhone = () => {
    updateApartmentContact(apt.id, { phone: phone.trim() || undefined });
    setEditingPhone(false);
  };

  const logout = () => {
    document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    document.cookie = `${ACCOUNT_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    router.push('/resident');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Настройки</h2>

      {/* Профиль */}
      <Card>
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-lg font-semibold text-white">
            {initials(apt.ownerName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{apt.ownerName}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 font-mono mt-0.5">{apt.accountNumber}</p>
          </div>
        </div>

        <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500">Площадь</p>
              <p className="font-medium text-stone-800 dark:text-stone-200 mt-0.5">{apt.area} м²</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500">Взнос / мес.</p>
              <p className="font-medium font-mono text-stone-800 dark:text-stone-200 mt-0.5">
                {formatCurrency(apt.monthlyFee)}
              </p>
            </div>
          </div>

          {editingPhone ? (
            <div className="flex items-end gap-2">
              <FormInput
                label="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+996 5XX XX-XX-XX"
                className="font-mono"
              />
              <Button variant="primary" size="sm" onClick={savePhone}>✓</Button>
              <Button variant="secondary" size="sm" onClick={() => { setPhone(apt.phone ?? ''); setEditingPhone(false); }}>✕</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500">Телефон</p>
                <p className="text-sm font-medium font-mono text-stone-800 dark:text-stone-200 mt-0.5">
                  {apt.phone || 'Не указан'}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditingPhone(true)}>
                Изменить
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Внешний вид */}
      <Card>
        <CardHeader title="Внешний вид" />
        <div className="p-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => applyTheme('light')}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition-colors ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              <span className="text-lg">☀️</span>
              <span className={`text-xs font-medium ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                Светлая
              </span>
            </button>
            <button
              type="button"
              onClick={() => applyTheme('dark')}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 transition-colors ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              <span className="text-lg">🌙</span>
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                Тёмная
              </span>
            </button>
          </div>
        </div>
      </Card>

      {/* Уведомления */}
      <Card>
        <CardHeader title="Уведомления" />
        <div className="p-5 space-y-4">
          <Switch
            label="Платежи и начисления"
            description="Напоминания об оплате и новых начислениях"
            checked={notifPayments}
            onChange={setNotifPayments}
          />
          <Switch
            label="Мои заявки"
            description="Изменение статуса по заявкам в ТСЖ"
            checked={notifRequests}
            onChange={setNotifRequests}
          />
          <Switch
            label="Новости ТСЖ"
            description="Объявления и общие новости дома"
            checked={notifNews}
            onChange={setNotifNews}
          />
        </div>
      </Card>

      {/* Аккаунт */}
      <Card>
        <div className="p-5 space-y-2">
          <Button variant="secondary" className="w-full justify-center" onClick={() => router.push('/resident')}>
            🔁 Сменить лицевой счёт
          </Button>
          <Button variant="danger" className="w-full justify-center" onClick={logout}>
            🚪 Выйти из личного кабинета
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-stone-300 dark:text-stone-600 pt-2">
        ТСЖ «Весна» · Личный кабинет жильца
      </p>
    </div>
  );
}
