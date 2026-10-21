import * as React from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as = 'h2',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const Heading = as;
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-display text-xs font-semibold tracking-[0.18em] text-solar-deep uppercase">
          {eyebrow}
        </span>
      ) : null}
      <Heading
        className={cn(
          'font-display font-semibold text-forest',
          as === 'h1'
            ? 'text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]'
            : as === 'h2'
              ? 'text-3xl leading-[1.15] sm:text-4xl'
              : 'text-xl leading-snug sm:text-2xl',
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed text-charcoal-soft',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
