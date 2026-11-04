import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileCode,
  Globe,
  Database,
  Server,
  Cloud,
  FileCheck2,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HubOverviewPage() {
  const scorecardLayers = [
    {
      no: 1,
      layer: 'Code',
      checksRun: 34,
      openIssues: 33,
      icon: FileCode,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      status: '33 open',
      badge: 'Action Required',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      no: 2,
      layer: 'Website',
      checksRun: 6,
      openIssues: 6,
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      status: '6 open',
      badge: 'Action Required',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      no: 3,
      layer: 'Server and API',
      checksRun: 0,
      openIssues: 0,
      icon: Server,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100',
      status: 'Not tested',
      badge: 'Pending Scan',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      no: 4,
      layer: 'Database',
      checksRun: 3,
      openIssues: 6,
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: '6 open',
      badge: 'Action Required',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      no: 5,
      layer: 'Hosting and Domain',
      checksRun: 3,
      openIssues: 3,
      icon: Cloud,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      status: '3 open',
      badge: 'Action Required',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      no: 6,
      layer: 'Release Proof',
      checksRun: 1,
      openIssues: 0,
      icon: Lock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      status: 'Not sealed',
      badge: 'Unsealed',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200">
              Release v1.0
            </span>
            <h1 className="text-2xl font-bold text-slate-900">CampusOne ERP</h1>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded border border-red-200">
              Action Required
            </span>
            <span className="bg-cyan-50 text-cyan-700 text-xs font-medium px-2 py-0.5 rounded border border-cyan-200">
              In-Browser Audit
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded">
              Sample Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Verified release package • Six-Line Security & Quality Scorecard • Cryptographic Manifest Sealed
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/developer/findings">
            <Button variant="primary" size="md" className="gap-2 shadow-sm font-semibold">
              <span>Inspect Findings (48)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/client/advisory">
            <Button variant="outline" size="md" className="gap-1.5 font-medium">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              <span>Client Advisory</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Severity Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/developer/findings" className="block group">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-red-300 transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>CRITICAL</span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">5</div>
            <div className="text-xs text-red-600 font-medium mt-1">Immediate threat</div>
          </div>
        </Link>

        <Link href="/developer/findings" className="block group">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>HIGH</span>
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">23</div>
            <div className="text-xs text-orange-600 font-medium mt-1">Severe exposure</div>
          </div>
        </Link>

        <Link href="/developer/findings" className="block group">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>MEDIUM</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">18</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Misconfiguration</div>
          </div>
        </Link>

        <Link href="/developer/findings" className="block group">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>LOW</span>
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">2</div>
            <div className="text-xs text-blue-600 font-medium mt-1">Best practice</div>
          </div>
        </Link>
      </div>

      {/* Six-Line Security & Quality Scorecard */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Six-Line Security & Quality Scorecard</h2>
            <p className="text-xs text-slate-500">Continuous pre-delivery audit across all application architectural layers</p>
          </div>
          <Link href="/developer/findings">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 gap-1">
              <span>Browse Filterable Findings (48)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {scorecardLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.no}
                className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg ${layer.bgColor} ${layer.color} flex items-center justify-center font-bold shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {layer.no}. {layer.layer}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {layer.checksRun} checks conducted
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${layer.badgeColor}`}>
                    {layer.status}
                  </span>
                  <Link href="/developer/findings">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

