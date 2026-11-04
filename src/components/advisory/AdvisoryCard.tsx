'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ChevronRight,
  FileCode,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Finding } from '@/data/mockFindings';
import { SeverityBadge, LayerBadge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AdvisoryCardProps {
  finding: Finding;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ finding }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-slate-200/90 shadow-xs hover:border-slate-300 transition-all bg-white overflow-hidden">
      {/* Card Header: Severity, Rule ID, Security Layer, Verification */}
      <div className="p-4 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/40">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={finding.severity} size="sm" />
          <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {finding.ruleId}
          </span>
          <LayerBadge layer={finding.layer} />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>In-Browser Audit Verified</span>
        </div>
      </div>

      {/* Card Body */}
      <CardContent className="p-5 space-y-3.5">
        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {finding.title}
        </h3>

        {/* Institutional Client Explanation: Executive Summary */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-1 bg-indigo-600 rounded-full" />
            Executive Summary
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3 rounded-lg border border-slate-100">
            {finding.executiveSummary || finding.clientExplanation}
          </p>
        </div>

        {/* Business Impact Pills */}
        {finding.riskImpact && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="text-xs text-slate-600 bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-md">
              <strong className="text-amber-800">Business Risk:</strong> {finding.riskImpact}
            </div>
          </div>
        )}

        {/* Collapsible Deep Mitigation Details */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-800">Client Talking Points:</div>
              <p className="text-slate-600 leading-relaxed">{finding.clientExplanation}</p>
            </div>
            {finding.threatVector && (
              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-800">Threat Vector:</div>
                <p className="text-slate-600 leading-relaxed">{finding.threatVector}</p>
              </div>
            )}
            <div className="flex justify-end pt-1">
              <Link href={`/developer/findings/${finding.id}`}>
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <span>View Technical Code Inspection</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>

      {/* Card Footer: Affected Asset on left, Confidence Badge on right */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-slate-600">
          <FileCode className="h-3.5 w-3.5 text-slate-400" />
          <span>Affected Asset:</span>
          <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
            {finding.location}
            {finding.line ? `:${finding.line}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
          >
            {expanded ? (
              <>
                <span>Less Details</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>More Details</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Confidence: {finding.confidence || 'High'}
          </span>
        </div>
      </div>
    </Card>
  );
};

