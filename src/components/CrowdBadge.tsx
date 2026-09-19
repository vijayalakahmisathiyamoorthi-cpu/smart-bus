import React from 'react';
import { CrowdStatus } from '../types';

interface CrowdBadgeProps {
  status: CrowdStatus | string;
  size?: 'sm' | 'md' | 'lg';
  standingCount?: number;
  showIcon?: boolean;
  className?: string;
}

export const CrowdBadge: React.FC<CrowdBadgeProps> = ({
  status,
  size = 'md',
  standingCount,
  className = '',
}) => {
  const rawStatus = (status || '').trim();
  const lower = rawStatus.toLowerCase();

  let colorClasses = 'bg-slate-800/90 text-slate-300 border-slate-700';
  let emoji = '⚪';
  let displayLabel = rawStatus || 'No Data';

  if (lower === 'less crowded') {
    colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950/40';
    emoji = '🟢';
    displayLabel = 'Less Crowded';
  } else if (lower === 'crowded') {
    colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-950/40';
    emoji = '🟡';
    displayLabel = 'Crowded';
  } else if (lower === 'overcrowded') {
    colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-950/40';
    emoji = '🔴';
    displayLabel = 'Overcrowded';
  } else if (lower === 'no data' || lower === 'nodata' || !rawStatus) {
    colorClasses = 'bg-slate-800/80 text-slate-400 border-slate-700';
    emoji = '⚪';
    displayLabel = 'No Data';
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-bold',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-extrabold',
  }[size];

  return (
    <span
      id={`crowd-badge-${displayLabel.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center rounded-xl border whitespace-nowrap tracking-wide transition-all ${colorClasses} ${sizeClasses} ${className}`}
    >
      <span className="text-xs sm:text-sm leading-none">{emoji}</span>
      <span>{displayLabel}</span>
      {typeof standingCount === 'number' && (
        <span className="opacity-90 font-mono text-[11px] font-normal ml-1">
          ({standingCount} standing)
        </span>
      )}
    </span>
  );
};

