'use client';

/**
 * Navbar.tsx — Top navigation bar with logo, nav links, dark mode toggle.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleDarkMode, toggleSidebar } from '@/store/uiSlice';
import {
  LayoutDashboard, Search, Heart, Building2,
  Sun, Moon, Menu, Bell, TrendingUp
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deals', href: '/deals', icon: Search },
  { name: 'My Interests', href: '/interests', icon: Heart },
  { name: 'Corporate', href: '/corporate', icon: Building2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const savedCount = useAppSelector((s) => s.savedDeals.deals.length);

  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Investor<span className="text-violet-600">Vault</span>
          </span>
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-violet-50 text-violet-600 border border-violet-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <Icon size={16} />
              {name}
              {name === 'My Interests' && savedCount > 0 && (
                <span className="ml-1 bg-violet-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {savedCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-md">
          AS
        </div>
      </div>
    </nav>
  );
}
