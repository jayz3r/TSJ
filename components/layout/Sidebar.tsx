'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard',  label: 'Обзор',      icon: '⊞', badge: null },
  { href: '/apartments', label: 'Квартиры',   icon: '🏢', badge: null },
  { href: '/accruals',   label: 'Начисления', icon: '📄', badge: null },
  { href: '/payments',   label: 'Платежи',    icon: '💵', badge: null },
  { href: '/expenses',   label: 'Расходы',    icon: '🧾', badge: null },
  { href: '/debts',      label: 'Долги',      icon: '⚠',  badge: '7'  },
  { href: '/requests',   label: 'Заявки',     icon: '🔧', badge: '3'  },
  { href: '/reports',    label: 'Отчёты',     icon: '📊', badge: null },
  { href: '/settings',   label: 'Настройки',  icon: '⚙',  badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
      {navItems.map(({ href, label, icon, badge }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors border-l-2 ${
              isActive
                ? 'bg-stone-50 text-stone-900 font-medium border-l-emerald-500'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 border-l-transparent'
            }`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-xs bg-red-100 text-red-700 font-medium px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop sidebar — только от lg (1024px) */}
      <aside className="hidden lg:flex w-52 shrink-0 bg-white border-r border-stone-200 flex-col h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-stone-100">
          <p className="text-sm font-semibold text-stone-900">ТСЖ «Весна»</p>
          <p className="text-xs text-stone-400 mt-0.5">ул. Ленина, 12 · 48 кв.</p>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="px-4 py-3 border-t border-stone-100">
          <p className="text-xs text-stone-400">Май 2025</p>
        </div>
      </aside>

      {/* Mobile/tablet topbar — до lg */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">ТСЖ «Весна»</p>
          <p className="text-xs text-stone-400">ул. Ленина, 12</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-stone-600 hover:text-stone-900 p-1"
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

      {/* Drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute top-0 left-0 bottom-0 w-64 bg-white flex flex-col pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 py-2 overflow-y-auto">
              <NavLinks />
            </nav>
            <div className="px-4 py-3 border-t border-stone-100">
              <p className="text-xs text-stone-400">Май 2025</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}