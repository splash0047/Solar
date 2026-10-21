import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Standard page banner used by every route except Home.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'border-b border-line bg-gradient-to-b from-ivory-soft to-ivory',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-9 sm:px-6 sm:pt-14 sm:pb-11 lg:px-8">
        {eyebrow ? (
          <p className="font-display text-xs font-semibold tracking-[0.18em] text-solar-deep uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-display text-3xl leading-[1.1] font-semibold text-forest sm:text-4xl lg:text-[2.85rem]">
          {title}
        </h1>
        {description ? (
          <div className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal-soft">
            {description}
          </div>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
