import * as React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tones = {
  info: { wrap: 'border-forest/25 bg-forest-soft/60 text-forest', Icon: Info },
  success: {
    wrap: 'border-success/30 bg-success-soft/70 text-success',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-solar-deep/30 bg-solar-soft/70 text-solar-deep',
    Icon: AlertTriangle,
  },
  danger: {
    wrap: 'border-danger/30 bg-danger-soft/70 text-danger',
    Icon: XCircle,
  },
} as const;

export type BannerTone = keyof typeof tones;

export function Banner({
  tone = 'info',
  title,
  children,
  icon,
  className,
}: {
  tone?: BannerTone;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const { wrap, Icon } = tones[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'note'}
      className={cn(
        'flex gap-3 rounded-card border px-4 py-3.5 text-sm leading-relaxed',
        wrap,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 [&_svg]:size-4.5" aria-hidden="true">
        {icon ?? <Icon />}
      </span>
      <div className="flex flex-col gap-1 text-charcoal">
        {title ? <p className="font-semibold text-forest">{title}</p> : null}
        {children ? <div className="text-charcoal-soft">{children}</div> : null}
      </div>
    </div>
  );
}
