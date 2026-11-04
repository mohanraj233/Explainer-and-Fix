'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  FileCheck2,
  Download,
  Share2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { mockFindings, severityCounts, Severity } from '@/data/mockFindings';
import { AdvisoryCard } from '@/components/advisory/AdvisoryCard';
import { Button } from '@/components/ui/Button';

export default function ClientAdvisoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  // Filter findings based on search and selected severity pill
  const filteredFindings = useMemo(() => {
    return mockFindings.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.ruleId.toLowerCase().includes(query) ||
        item.layer.toLowerCase().includes(query) ||
        item.clientExplanation.toLowerCase().includes(query) ||
        item.executiveSummary.toLowerCase().includes(query) ||
        (item.riskImpact && item.riskImpact.toLowerCase().includes(query));

      const matchesSeverity =
        selectedSeverity === 'All' || item.severity === selectedSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [searchQuery, selectedSeverity]);

  const severityPills: Array<{ label: string; count: number; value: string }> = [
    { label: 'All', count: severityCounts.All, value: 'All' },
    { label: 'Critical', count: severityCounts.Critical, value: 'Critical' },
    { label: 'High', count: severityCounts.High, value: 'High' },
    { label: 'Medium', count: severityCounts.Medium, value: 'Medium' },
    { label: 'Low', count: severityCounts.Low, value: 'Low' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded bg-emerald-100 text-emerald-800">
              <FileCheck2 className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Client-Facing Executive Security Dashboard
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Plain-Language Advisory Explanations
          </h1>

          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Each discovered security flaw is explained in terms of what it means for the client and how it affects risk.
          </p>
        </div>

        {/* Action Buttons: Download PDF, Switch to Developer */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/developer/findings">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-9">
              <Terminal className="h-3.5 w-3.5 text-indigo-600" />
              <span>Developer Code View</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            className="text-xs gap-1.5 h-9 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Advisory Report (PDF)</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Finding title, Risk impact, Rule ID, Architectural layer..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Severity Filter Toggle Group with Live Counts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filter by Severity:</span>
          {severityPills.map((pill) => {
            const isActive = selectedSeverity === pill.value;
            return (
              <button
                key={pill.value}
                onClick={() => setSelectedSeverity(pill.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}

          {(searchQuery || selectedSeverity !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('All');
              }}
              className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 py-1 px-2 rounded hover:bg-indigo-50"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Advisory Cards List / Grid */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-700 text-base">No advisory explanations found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No security items matched your query. Try resetting your search terms.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <AdvisoryCard key={finding.id} finding={finding} />
          ))
        )}
      </div>
    </div>
  );
}

