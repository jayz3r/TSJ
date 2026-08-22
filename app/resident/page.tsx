'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import {
  ACCOUNT_COOKIE_NAME,
  ADMIN_LOGIN_ID,
  ROLE_COOKIE_NAME,
} from '@/lib/role';

export default function ResidentLoginPage() {
  const apartments = useAppStore((s) => s.apartments);
  const [account, setAccount] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginId = account.trim().toUpperCase();

    if (loginId === ADMIN_LOGIN_ID) {
      document.cookie = `${ROLE_COOKIE_NAME}=admin; path=/; max-age=2592000; samesite=lax`;
      document.cookie = `${ACCOUNT_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      window.location.assign('/dashboard');
      return;
    }

    const found = apartments.find(
      (a) => a.accountNumber.toLowerCase() === loginId.toLowerCase()
    );
    if (found) {
      document.cookie = `${ROLE_COOKIE_NAME}=user; path=/; max-age=2592000; samesite=lax`;
      document.cookie = `${ACCOUNT_COOKIE_NAME}=${encodeURIComponent(found.accountNumber)}; path=/; max-age=2592000; samesite=lax`;
      window.location.assign(`/resident/${found.accountNumber}`);
    } else {
      setError('Лицевой счёт не найден. Проверьте номер.');
    }
  };

  return (
    <div className="min-h-screen -m-4 lg:-m-6 -mt-16 lg:-mt-6 bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Лого */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🏢
          </div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">ТСЖ «Весна»</h1>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">Личный кабинет жильца</p>
        </div>

        {/* Форма */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm dark:bg-stone-900 dark:border-stone-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-500">
                Лицевой счёт или ID администратора
              </label>
              <input
                type="text"
                value={account}
                onChange={(e) => { setAccount(e.target.value); setError(''); }}
                placeholder="ЛС-00101 или ADMIN-001"
                autoComplete="off"
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-300 font-mono tracking-wide dark:bg-stone-900 dark:border-stone-700 dark:placeholder:text-stone-600 dark:text-stone-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Войти
            </button>
          </form>

          <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-5 leading-relaxed">
            Житель: номер лицевого счёта из квитанции.<br />
            Администратор: используйте свой уникальный ID.
          </p>
        </div>
      </div>
    </div>
  );
}