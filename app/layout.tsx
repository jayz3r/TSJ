import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const geist     = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'ТСЖ Весна',
  description: 'Финансовая панель управления ТСЖ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} font-sans bg-stone-50 text-stone-900 antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          {/* pt-14 на мобиле/планшете, pt-6 на десктопе */}
          <main className="flex-1 min-w-0 p-4 lg:p-6 pt-16 lg:pt-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}