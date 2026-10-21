import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      tone: {
        neutral: 'border-line bg-ivory-deep text-charcoal-soft',
        forest: 'border-forest/25 bg-forest-soft text-forest',
        sage: 'border-sage-deep/30 bg-sage-soft text-sage-deep',
        solar: 'border-solar-deep/30 bg-solar-soft text-solar-deep',
        danger: 'border-danger/30 bg-danger-soft text-danger',
        success: 'border-success/30 bg-success-soft text-success',
        outline: 'border-line-strong bg-transparent text-charcoal-soft',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-[0.6875rem] tracking-wide',
        md: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  );
}

