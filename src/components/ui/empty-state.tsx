import * as React from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-line-strong bg-ivory-soft/60 px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? (
        <span
          className="flex size-12 items-center justify-center rounded-full bg-forest-soft text-forest [&_svg]:size-5"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-base font-semibold text-forest">{title}</p>
        {description ? (
          <p className="max-w-md text-sm leading-relaxed text-charcoal-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
