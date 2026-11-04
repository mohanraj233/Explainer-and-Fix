'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Status } from '@/data/mockFindings';

interface TriageCardProps {
  initialStatus?: Status;
  findingId: string;
}

export const TriageCard: React.FC<TriageCardProps> = ({
  initialStatus = 'Open',
  findingId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>(initialStatus);
  const [waiverReason, setWaiverReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  return (
    <Card className="border-slate-200/90 shadow-xs relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-3 right-4 z-20 flex items-center gap-2 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Finding status updated to <strong>{selectedStatus}</strong></span>
        </div>
      )}

      <CardHeader className="bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-indigo-600" />
          <CardTitle>Finding Triage & Risk Acceptance</CardTitle>
        </div>
        <CardDescription>
          Manage the remediation lifecycle. Document formal waivers when accepting residual security risk.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {/* Radio Option 1: Open */}
        <div
          onClick={() => setSelectedStatus('Open')}
          className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3.5 ${
            selectedStatus === 'Open'
              ? 'border-red-500 bg-red-50/20 ring-1 ring-red-500/20'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="pt-0.5">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === 'Open'}
              onChange={() => setSelectedStatus('Open')}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Open (Needs Fixing)
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Vulnerability remains unresolved in current codebase.
            </p>
          </div>
        </div>

        {/* Radio Option 2: Accept Risk (Waiver) */}
        <div
          onClick={() => setSelectedStatus('Accepted')}
          className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col gap-2 ${
            selectedStatus === 'Accepted'
              ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600/20'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="pt-0.5">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === 'Accepted'}
                onChange={() => setSelectedStatus('Accepted')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Accept Risk (Waiver)
                </span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Documented business justification or non-production environment.
              </p>
            </div>
          </div>

          {selectedStatus === 'Accepted' && (
            <div className="mt-2 pl-7">
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Formal Waiver Justification (Required for Audit Compliance):
              </label>
              <textarea
                value={waiverReason}
                onChange={(e) => setWaiverReason(e.target.value)}
                placeholder="Enter business risk sign-off justification (e.g., internal staging cluster only, access isolated by VPC)..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Radio Option 3: Mark as Fixed */}
        <div
          onClick={() => setSelectedStatus('Fixed')}
          className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-3.5 ${
            selectedStatus === 'Fixed'
              ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600/20'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="pt-0.5">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === 'Fixed'}
              onChange={() => setSelectedStatus('Fixed')}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Mark as Fixed
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Code refactored or patched per remediation guidelines.
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 pt-4">
        <Link href="/developer/findings">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to List
          </Button>
        </Link>

        <Button
          variant="primary"
          size="sm"
          onClick={handleUpdate}
          isLoading={isUpdating}
          className="text-xs font-semibold px-4"
        >
          Update Finding Status
        </Button>
      </CardFooter>
    </Card>
  );
};

