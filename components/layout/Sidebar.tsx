'use client';

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

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-stone-200 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-stone-100">
        <p className="text-sm font-semibold text-stone-900">ТСЖ «Весна»</p>
        <p className="text-xs text-stone-400 mt-0.5">ул. Ленина, 12 · 48 кв.</p>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ href, label, icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors border-l-2 ${
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
      </nav>

      <div className="px-4 py-3 border-t border-stone-100">
        <p className="text-xs text-stone-400">Май 2025</p>
      </div>
    </aside>
  );
}