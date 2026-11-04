import React from 'react';
import { cn } from '@/lib/utils';
import { Severity, Status, Layer } from '@/data/mockFindings';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className, size = 'md' }) => {
  const styles: Record<Severity, string> = {
    Critical: 'bg-red-50 text-red-700 border-red-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const dotStyles: Record<Severity, string> = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-amber-500',
    Low: 'bg-blue-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide transition-colors',
        styles[severity] || styles.Low,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[severity] || dotStyles.Low)} />
      {severity}
    </span>
  );
};

export const LayerBadge: React.FC<{ layer: Layer | string; className?: string }> = ({ layer, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700',
        className
      )}
    >
      {layer}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: Status; className?: string }> = ({ status, className }) => {
  const styles: Record<Status, string> = {
    Open: 'bg-rose-50 text-rose-700 border-rose-200',
    Accepted: 'bg-slate-100 text-slate-700 border-slate-300',
    Fixed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        styles[status] || styles.Open,
        className
      )}
    >
      {status}
    </span>
  );
};

export const VerificationBadge: React.FC<{ verified?: boolean; className?: string }> = ({
  verified = true,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Verified in Browser
    </span>
  );
};

