import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  FileCode,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCw,
  Share2,
} from 'lucide-react';
import { getFindingById, mockFindings } from '@/data/mockFindings';
import { SeverityBadge, LayerBadge, VerificationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CodeEvidenceBlock } from '@/components/findings/CodeEvidenceBlock';
import { ExplanationsCard } from '@/components/findings/ExplanationsCard';
import { TriageCard } from '@/components/findings/TriageCard';

interface FindingDetailPageProps {
  params: {
    id: string;
  };
}

export default function FindingDetailPage({ params }: FindingDetailPageProps) {
  // Find finding by rule or ID, fallback to DBA-003
  const finding = getFindingById(params.id) || mockFindings[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link
            href="/developer/findings"
            className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Findings List</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{finding.ruleId} Detail</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/client/advisory">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <span>View Client Explanation</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Header & Metadata */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <SeverityBadge severity={finding.severity} size="md" />
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Rule: {finding.ruleId}
          </span>
          <LayerBadge layer={finding.layer} className="text-xs px-2.5 py-1" />
          <VerificationBadge verified={finding.verifiedInBrowser} />
          {finding.cwe && (
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              {finding.cwe}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {finding.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-500 font-mono pt-1">
          <FileCode className="h-4 w-4 text-slate-400" />
          <span>Location:</span>
          <code className="text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {finding.location} {finding.line ? `(line ${finding.line})` : ''}
          </code>
        </div>
      </div>

      {/* SECTION 1: Masked Evidence Snippet (CWE Verification) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            Masked Evidence Snippet (CWE Verification)
          </h2>
          <span className="text-xs text-slate-400">Deterministic Scanner Trace</span>
        </div>

        <CodeEvidenceBlock
          location={finding.location}
          line={finding.line}
          snippet={finding.maskedSnippet}
        />
      </section>

      {/* SECTION 2: Plain-English Explanations & 1-Click AI Fixes */}
      <section className="space-y-2">
        <ExplanationsCard
          clientExplanation={finding.clientExplanation}
          developerGuidance={finding.developerGuidance}
          oneClickAiPrompt={finding.oneClickAiPrompt}
          suggestedPatch={finding.suggestedPatch}
          findingTitle={finding.title}
        />
      </section>

      {/* SECTION 3: Finding Triage & Risk Acceptance */}
      <section className="space-y-2">
        <TriageCard initialStatus={finding.status} findingId={finding.id} />
      </section>
    </div>
  );
}

