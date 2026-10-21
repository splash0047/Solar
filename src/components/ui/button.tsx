import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-[background-color,color,box-shadow,border-color,transform] duration-200 disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest active:translate-y-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-forest text-ivory-soft shadow-soft hover:bg-forest-mid hover:shadow-lift',
        solar:
          'bg-solar text-forest-deep shadow-soft hover:bg-[#e0a03c] hover:shadow-lift',
        secondary:
          'bg-ivory-soft text-forest border border-line-strong hover:border-forest hover:bg-ivory',
        outline:
          'bg-transparent text-forest border border-forest/35 hover:bg-forest hover:text-ivory-soft hover:border-forest',
        ghost: 'bg-transparent text-charcoal hover:bg-forest-soft hover:text-forest',
        danger:
          'bg-danger text-ivory-soft shadow-soft hover:bg-[#9d3b27] hover:shadow-lift',
        link: 'bg-transparent text-forest underline decoration-line-strong underline-offset-4 hover:decoration-forest',
      },
      size: {
        sm: 'h-9 px-3.5 text-[0.8125rem] [&_svg]:size-4',
        md: 'h-11 px-5 text-sm [&_svg]:size-4',
        lg: 'h-13 px-7 text-[0.9375rem] [&_svg]:size-[1.125rem]',
        icon: 'size-10 [&_svg]:size-4',
        'icon-sm': 'size-8 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

