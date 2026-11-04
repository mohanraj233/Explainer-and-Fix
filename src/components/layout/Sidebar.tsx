'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Layers,
  ListFilter,
  Sparkles,
  Radio,
  Globe,
  MailCheck,
  FileText,
  CreditCard,
  Settings,
  ChevronDown,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const safetyItems = [
    {
      name: 'Hub Overview',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      name: 'Inspected Releases',
      href: '/developer/findings',
      icon: Layers,
      active: pathname === '/releases',
      badge: 'v1.0',
    },
    {
      name: 'AI Findings Catalog',
      href: '/developer/findings',
      icon: ListFilter,
      active: pathname.startsWith('/developer/findings'),
      count: '48',
    },
    {
      name: 'Client Advisory',
      href: '/client/advisory',
      icon: FileText,
      active: pathname.startsWith('/client/advisory'),
      badge: 'Client',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'ZeroLeak AI Sanitizer',
      href: '#zeroleak',
      icon: Sparkles,
      active: false,
      badge: 'Active',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      name: 'LogSentinel Threat Radar',
      href: '#logsentinel',
      icon: Radio,
      active: false,
    },
    {
      name: 'Domain & DNS Inspector',
      href: '#dns',
      icon: Globe,
      active: false,
    },
    {
      name: 'Email Spoofing',
      href: '#email',
      icon: MailCheck,
      active: false,
    },
  ];

  const complianceItems = [
    {
      name: 'Plans & GST Invoicing',
      href: '#billing',
      icon: CreditCard,
      active: false,
    },
    {
      name: 'Workspace Settings',
      href: '#settings',
      icon: Settings,
      active: false,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight text-lg">VibeProofLens</span>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide shadow-xs">
              PRO
            </span>
          </div>
        </div>

        {/* Project Context Box */}
        <div className="px-4 py-3 mx-3 my-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-6 w-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
              C1
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-800 truncate">CampusOne ERP</div>
              <div className="text-[10px] text-slate-500 truncate">Release v1.0 • Sealed</div>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-2 space-y-6">
          {/* Section: Pre-delivery Safety */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Pre-delivery Safety
            </div>
            <nav className="space-y-0.5">
              {safetyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all',
                      item.active
                        ? 'border-l-4 border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold pl-2.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          item.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.count && (
                        <span className="bg-slate-200/80 text-slate-700 text-[11px] px-1.5 py-0.2 rounded font-semibold">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-medium',
                            item.badgeColor || 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Studio & Git Compliance */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Studio & Git Compliance
            </div>
            <nav className="space-y-0.5">
              {complianceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all',
                      item.active
                        ? 'border-l-4 border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold pl-2.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          item.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer / User Profile & ZeroLeak Status */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <div className="flex items-center justify-between px-2 py-1.5 mb-2 rounded bg-purple-50/70 border border-purple-100">
          <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium">
            <Lock className="h-3.5 w-3.5 text-purple-600" />
            <span>ZeroLeak Engine</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
            MR
          </div>
          <div className="flex-1 truncate">
            <div className="text-xs font-semibold text-slate-800 truncate">Mohanraj (Dev)</div>
            <div className="text-[10px] text-slate-400 truncate">VibeProof Security Lead</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

