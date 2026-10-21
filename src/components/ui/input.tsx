import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'h-11 w-full rounded-control border border-line-strong bg-ivory-soft px-3.5 text-sm text-charcoal shadow-[inset_0_1px_1px_rgb(37_45_42_/_0.03)] transition-colors placeholder:text-charcoal-faint hover:border-sage-deep focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest disabled:cursor-not-allowed disabled:bg-ivory-deep disabled:text-charcoal-faint',
      'aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:outline-danger',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      'w-full rounded-control border border-line-strong bg-ivory-soft px-3.5 py-2.5 text-sm leading-relaxed text-charcoal shadow-[inset_0_1px_1px_rgb(37_45_42_/_0.03)] transition-colors placeholder:text-charcoal-faint hover:border-sage-deep focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest disabled:cursor-not-allowed disabled:bg-ivory-deep disabled:text-charcoal-faint',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-11 w-full appearance-none rounded-control border border-line-strong bg-ivory-soft bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%235c6560%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:1.05rem] bg-[position:right_0.85rem_center] bg-no-repeat px-3.5 pr-10 text-sm text-charcoal transition-colors hover:border-sage-deep focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest disabled:cursor-not-allowed disabled:bg-ivory-deep disabled:text-charcoal-faint',
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
