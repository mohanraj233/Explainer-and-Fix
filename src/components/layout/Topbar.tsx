'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ChevronRight,
  Bell,
  Sparkles,
  ChevronDown,
  Layers,
  Terminal,
  FileText,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);

  // Generate dynamic breadcrumb segments based on current route
  const getBreadcrumbs = () => {
    if (pathname.includes('/developer/findings/')) {
      const parts = pathname.split('/');
      const findingId = parts[parts.length - 1];
      return [
        { label: 'CampusOne ERP', href: '/' },
        { label: 'Releases v1.0', href: '/developer/findings' },
        { label: 'Findings Catalog', href: '/developer/findings' },
        { label: `${findingId} Detail`, href: pathname, current: true },
      ];
    }
    if (pathname.startsWith('/developer/findings')) {
      return [
        { label: 'CampusOne ERP', href: '/' },
        { label: 'Releases v1.0', href: '/developer/findings' },
        { label: 'Findings Catalog', href: '/developer/findings', current: true },
      ];
    }
    if (pathname.startsWith('/client/advisory')) {
      return [
        { label: 'CampusOne ERP', href: '/' },
        { label: 'Client Portal', href: '/client/advisory' },
        { label: 'Advisory Explanations', href: '/client/advisory', current: true },
      ];
    }
    return [
      { label: 'CampusOne ERP', href: '/' },
      { label: 'Dashboard Overview', href: '/', current: true },
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  const isClientView = pathname.startsWith('/client');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-slate-500 overflow-hidden">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
            {crumb.current ? (
              <span className="font-semibold text-slate-800 truncate">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-indigo-600 transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Center & Right Navigation controls */}
      <div className="flex items-center space-x-4">
        {/* Dual-Perspective Quick Toggle (Developer vs Client) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <Link
            href="/developer/findings"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all',
              !isClientView
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            Developer View
          </Link>
          <Link
            href="/client/advisory"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all',
              isClientView
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            Client Advisory
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search (Rule, File)..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-10 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Demo Sandbox Dropdown Badge (Yellow Background) */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800 shadow-xs cursor-pointer hover:bg-amber-100 transition-colors">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Demo Sandbox</span>
          <ChevronDown className="h-3 w-3 text-amber-700 ml-0.5" />
        </div>

        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Icon */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-100 shadow-xs">
            MR
          </div>
        </div>
      </div>
    </header>
  );
};

