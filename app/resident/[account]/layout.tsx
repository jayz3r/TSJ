'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { ThemeToggle } from '@/components/themebutton/themetoggle';
import Link from 'next/link';

const navItems = [
  { href: '', label: 'Обзор', icon: '⊞' },
  { href: '/payments', label: 'Платежи', icon: '💵' },
  { href: '/accruals', label: 'Начисления', icon: '📄' },
  { href: '/requests', label: 'Заявки', icon: '🔧' },
  { href: '/settings', label: 'Настройки', icon: '⚙️' },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const { account } = useParams<{ account: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const apartments = useAppStore((s) => s.apartments);

  const apt = apartments.find(
    (a) => a.accountNumber === decodeURIComponent(account)
  );

  if (!apt) {
    return (
      <div className="min-h-screen -m-4 lg:-m-6 -mt-16 lg:-mt-6 flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <p className="text-stone-500 dark:text-stone-500 mb-4 text-sm">Лицевой счёт не найден</p>
          <button
            onClick={() => router.push('/resident')}
            className="text-sm text-emerald-600 hover:text-emerald-800"
          >
            ← Вернуться
          </button>
        </div>
      </div>
    );
  }

  const base = `/resident/${account}`;

  return (
    <div className="min-h-screen -m-4 lg:-m-6 -mt-16 lg:-mt-6 bg-stone-50 dark:bg-stone-950">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-emerald-950">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sm font-semibold text-white">
              {initials(apt.ownerName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{apt.ownerName}</p>
              <p className="text-xs text-emerald-100 font-mono mt-0.5">{apt.accountNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle className="!border-white/20 !text-white hover:!bg-white/15" />
            <button
              onClick={() => router.push('/resident')}
              aria-label="Выйти"
              title="Выйти"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/20 text-white hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Табы */}
        <div className="max-w-lg mx-auto px-4 flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map(({ href, label, icon }) => {
            const fullHref = base + href;
            const isActive = href === ''
              ? pathname === base || pathname === base + '/'
              : pathname.startsWith(fullHref);
            return (
              <Link
                key={href}
                href={fullHref}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${isActive
                    ? 'bg-white text-emerald-700'
                    : 'text-emerald-50 hover:bg-white/15'
                  }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Контент */}
      <main className="max-w-lg mx-auto px-4 py-6 -mt-1">
        {children}
      </main>
    </div>
  );
}