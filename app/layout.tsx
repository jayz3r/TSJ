import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { parseRole, ROLE_COOKIE_NAME, type UserRole } from '@/lib/role';
import { parseTheme, THEME_COOKIE_NAME, THEME_INIT_SCRIPT } from '@/lib/theme';

const geist     = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'ТСЖ Весна',
  description: 'Финансовая панель управления ТСЖ',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role: UserRole = parseRole(cookieStore.get(ROLE_COOKIE_NAME)?.value);
  const theme = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <html lang="ru" className={theme === 'dark' ? 'dark' : undefined} suppressHydrationWarning>
      <head>
        {/* Sets the theme class before first paint for visitors without the
            cookie yet (first visit), based on OS preference — prevents a
            light-then-dark flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} font-sans text-stone-900 dark:text-stone-100 antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar role={role} />
          {/* pt-14 на мобиле/планшете, pt-6 на десктопе */}
          <main className="flex-1 min-w-0 p-4 lg:p-6 pt-16 lg:pt-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}