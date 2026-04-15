import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/Components/StoreProvider';
import Navbar from '@/Components/Navbar';

import ThemeWrapper from '@/Components/ThemeWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'InvestorVault — Fintech Dashboard',
  description: 'A modern investor & corporate dashboard for tracking deals, ROI, and portfolio health.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-slate-900 antialiased min-h-screen">
        <StoreProvider>
          <ThemeWrapper>
            <Navbar />
            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ThemeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
