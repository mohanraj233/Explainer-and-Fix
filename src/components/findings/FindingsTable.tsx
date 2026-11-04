'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { mockFindings, Finding, Severity, Layer, Status } from '@/data/mockFindings';
import { SeverityBadge, LayerBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

export const FindingsTable: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter findings based on user criteria
  const filteredFindings = useMemo(() => {
    return mockFindings.filter((item) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.ruleId.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.cwe && item.cwe.toLowerCase().includes(query));

      // Severity filter
      const matchesSeverity =
        selectedSeverity === 'All' || item.severity === selectedSeverity;

      // Layer filter
      const matchesLayer =
        selectedLayer === 'All' || item.layer === selectedLayer;

      // Status filter
      const matchesStatus =
        selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesSeverity && matchesLayer && matchesStatus;
    });
  }, [searchQuery, selectedSeverity, selectedLayer, selectedStatus]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('All');
    setSelectedLayer('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedSeverity !== 'All' ||
    selectedLayer !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Rule ID, Finding Title, File Path, CWE..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Severities Filter */}
          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical (5)</option>
              <option value="High">High (23)</option>
              <option value="Medium">Medium (18)</option>
              <option value="Low">Low (2)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Layer Filter */}
          <div className="relative">
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Layers</option>
              <option value="Code">Code</option>
              <option value="Database">Database</option>
              <option value="Website">Website</option>
              <option value="Hosting">Hosting</option>
              <option value="Server and API">Server & API</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Accepted">Accepted Waiver</option>
              <option value="Fixed">Fixed / Verified</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Severity</TableHead>
              <TableHead className="w-28">Rule</TableHead>
              <TableHead className="w-28">Layer</TableHead>
              <TableHead>Vulnerability Description</TableHead>
              <TableHead className="w-44">File Location</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFindings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <ShieldAlert className="h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-600">No security findings matched your filters</p>
                    <p className="text-xs text-slate-400">Try adjusting your search terms or clearing selected dropdowns</p>
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2">
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredFindings.map((finding) => (
                <TableRow
                  key={finding.id}
                  className="cursor-pointer group"
                  onClick={() => router.push(`/developer/findings/${finding.id}`)}
                >
                  <TableCell>
                    <SeverityBadge severity={finding.severity} size="sm" />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                      {finding.ruleId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <LayerBadge layer={finding.layer} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                        {finding.title}
                      </div>
                      {finding.cwe && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {finding.cwe.split(':')[0]}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200/60 w-fit">
                      <FileCode className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {finding.location}
                        {finding.line ? `:${finding.line}` : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={finding.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/developer/findings/${finding.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-8 text-xs font-semibold px-3 gap-1 shadow-xs group-hover:bg-indigo-700"
                      >
                        Review
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Footer with counter and pagination info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredFindings.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{mockFindings.length}</span> security findings
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Cryptographic SHA-256 Audit Sealed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

