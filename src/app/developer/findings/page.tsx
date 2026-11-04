import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Sparkles,
  Layers,
  FileCheck2,
  Download,
  GitCompare,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { FindingsTable } from '@/components/findings/FindingsTable';
import { Button } from '@/components/ui/Button';

export default function FindingsCatalogPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Discovered Issues & AI Fixes (48 of 48)
            </h1>

            {/* Badges as specified */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              In-Browser Audit
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              Sample Data
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            CampusOne ERP • Release v1.0 • Complete security findings register with ZeroLeak sanitized AI remediation.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href="/client/advisory">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-9">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Switch to Client Advisory</span>
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="text-xs gap-1.5 h-9">
            <GitCompare className="h-3.5 w-3.5 text-slate-500" />
            <span>Compare Releases</span>
          </Button>
        </div>
      </div>

      {/* Severity Summary Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-red-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Critical Severity</div>
            <div className="text-xl font-bold text-red-600">5</div>
          </div>
          <span className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
            Immediate Threat
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-orange-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">High Severity</div>
            <div className="text-xl font-bold text-orange-600">23</div>
          </div>
          <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
            Severe Exposure
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Medium Severity</div>
            <div className="text-xl font-bold text-amber-600">18</div>
          </div>
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
            Misconfiguration
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Low Severity</div>
            <div className="text-xl font-bold text-blue-600">2</div>
          </div>
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            Best Practice
          </span>
        </div>
      </div>

      {/* Data Table with Search and Filters */}
      <FindingsTable />
    </div>
  );
}

