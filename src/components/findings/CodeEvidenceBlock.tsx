'use client';

import React, { useState } from 'react';
import { Copy, Check, Shield, FileCode, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeEvidenceBlockProps {
  location: string;
  line?: number;
  snippet: string;
}

export const CodeEvidenceBlock: React.FC<CodeEvidenceBlockProps> = ({
  location,
  line = 3,
  snippet,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-slate-900 text-slate-100">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-300">
          <FileCode className="h-4 w-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">{location}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400">line {line}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
            <Shield className="h-3 w-3" />
            ZeroLeak Masked
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 px-2.5 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Evidence</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Evidence</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto bg-[#0d1117]">
        <pre className="text-slate-200">
          <code>
            {snippet.split('\n').map((codeLine, idx) => (
              <div key={idx} className="table-row">
                <span className="table-cell pr-4 text-slate-600 select-none text-xs text-right">
                  {idx + 1}
                </span>
                <span className="table-cell">
                  {codeLine.includes('VPL_FAKE') ? (
                    <span>
                      {codeLine.split('"VPL_FAKE').map((part, i) =>
                        i === 0 ? (
                          part
                        ) : (
                          <React.Fragment key={i}>
                            <span className="bg-red-950/80 text-rose-300 font-bold px-1.5 py-0.5 rounded border border-rose-800/50">
                              "VPL_FAKE{part.split('"')[0]}"
                            </span>
                            {part.substring(part.indexOf('"') + 1)}
                          </React.Fragment>
                        )
                      )}
                    </span>
                  ) : (
                    codeLine
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Disclaimer / ZeroLeak Policy notice */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-purple-400 shrink-0" />
          <span>All production secrets and private tokens masked with <code className="text-slate-300 font-mono">VPL_FAKE</code> placeholders.</span>
        </div>
        <span className="text-slate-500 hidden sm:inline">CWE-798 Verification Protected</span>
      </div>
    </div>
  );
};

