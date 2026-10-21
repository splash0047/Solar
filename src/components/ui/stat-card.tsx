import * as React from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  unit,
  caption,
  icon,
  tone = 'forest',
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  caption?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'forest' | 'solar' | 'sage' | 'neutral';
  className?: string;
}) {
  const toneStyles: Record<string, string> = {
    forest: 'bg-forest-soft text-forest',
    solar: 'bg-solar-soft text-solar-deep',
    sage: 'bg-sage-soft text-sage-deep',
    neutral: 'bg-ivory-deep text-charcoal-soft',
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-card border border-line bg-ivory-soft p-5 shadow-soft',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8125rem] font-medium text-charcoal-soft">{label}</p>
        {icon ? (
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4',
              toneStyles[tone],
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl leading-none font-semibold text-forest tabular-nums">
          {value}
        </span>
        {unit ? (
          <span className="text-sm font-medium text-charcoal-soft">{unit}</span>
        ) : null}
      </p>
      {caption ? (
        <p className="text-xs leading-relaxed text-charcoal-faint">{caption}</p>
      ) : null}
    </div>
  );
}
