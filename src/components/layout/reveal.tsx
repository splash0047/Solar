import * as React from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type RevealTag = 'div' | 'section' | 'li' | 'article';

const supportsObserver = typeof IntersectionObserver !== 'undefined';

/**
 * Scroll-triggered reveal. Falls back to visible immediately when the user
 * prefers reduced motion or the browser lacks IntersectionObserver.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: RevealTag;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [observed, setObserved] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || !supportsObserver || prefersReduced === true) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setObserved(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReduced]);

  const visible = prefersReduced === true || !supportsObserver || observed;

  return React.createElement(
    as,
    {
      ref,
      'data-reveal': visible ? 'visible' : '',
      style:
        visible && prefersReduced !== true
          ? { animationDelay: `${delay}ms` }
          : undefined,
      className: cn(className),
    },
    children,
  );
}
