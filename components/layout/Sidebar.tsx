'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ACCOUNT_COOKIE_NAME, ROLE_COOKIE_NAME, type UserRole } from '@/lib/role';
import { ThemeToggle } from '@/components/themebutton/themetoggle';

const navItems = [
  { href: '/dashboard',  label: 'Обзор',      icon: '⊞', badge: null },
  { href: '/accruals',   label: 'Начисления', icon: '📄', badge: null },
  { href: '/payments',   label: 'Платежи',    icon: '💵', badge: null },
  { href: '/expenses',   label: 'Расходы',    icon: '🧾', badge: null },
  { href: '/debts',      label: 'Долги',      icon: '⚠',  badge: '7'  },
  { href: '/requests',   label: 'Заявки',     icon: '🔧', badge: '3'  },
  { href: '/reports',    label: 'Отчёты',     icon: '📊', badge: null },
  { href: '/settings',   label: 'Настройки',  icon: '⚙',  badge: null },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (role !== 'admin') return null;

  const handleLogout = () => {
    document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    document.cookie = `${ACCOUNT_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    router.push('/resident');
    router.refresh();
  };

  const residentItem = {
    href: role === 'admin' ? '/admin/residents' : '/residents',
    label: role === 'admin' ? 'Жильцы' : 'Жильцы',
    icon: '🏢',
    badge: null,
  };
  const visibleNavItems = [navItems[0], residentItem, ...navItems.slice(1)];

  const navLinks = visibleNavItems.map(({ href, label, icon, badge }) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors border-l-2 ${
          isActive
            ? 'bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 font-medium border-l-emerald-500'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 border-l-transparent'
        }`}
      >
        <span className="text-base w-5 text-center">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="text-xs bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 font-medium px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  });

  return (
    <>
      {/* Desktop sidebar — только от lg (1024px) */}
      <aside className="hidden lg:flex w-52 shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex-col h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-stone-100 dark:border-stone-800 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">ТСЖ «Весна»</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">ул. Ленина, 12 · 48 кв.</p>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {navLinks}
        </nav>
        <div className="px-4 py-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{role === 'admin' ? 'Администратор' : 'Житель'}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">Май 2025</p>
          </div>
          <button
            onClick={handleLogout}
            title="Выйти из аккаунта"
            className="text-xs font-medium text-stone-500 dark:text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 border border-stone-200 dark:border-stone-800 hover:border-red-200 dark:hover:border-red-800 rounded-lg px-2.5 py-1.5 transition-colors shrink-0"
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile/tablet topbar — до lg */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">ТСЖ «Весна»</p>
          <p className="text-xs text-stone-400 dark:text-stone-500">ул. Ленина, 12</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 p-1"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-stone-900 flex flex-col pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 py-2 overflow-y-auto">
              {navLinks}
            </nav>
            <div className="px-4 py-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{role === 'admin' ? 'Администратор' : 'Житель'}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">Май 2025</p>
              </div>
              <button
                onClick={handleLogout}
                title="Выйти из аккаунта"
                className="text-xs font-medium text-stone-500 dark:text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 border border-stone-200 dark:border-stone-800 hover:border-red-200 dark:hover:border-red-800 rounded-lg px-2.5 py-1.5 transition-colors shrink-0"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}