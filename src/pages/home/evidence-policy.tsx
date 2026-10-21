import { Link } from 'react-router-dom';
import { BarChart3, FlaskConical, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/layout/reveal';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    icon: FlaskConical,
    tone: 'forest' as const,
    label: 'Measured',
    title: 'Recorded in the dashboard',
    body: 'Every number in the dashboard is computed from rows you entered. The mean indoor temperature reduction is the mean of the per-row differences from the same rows, and the count behind it is always shown.',
    cta: { to: '/dashboard', label: 'Record a session' },
  },
  {
    icon: BarChart3,
    tone: 'solar' as const,
    label: 'Illustrative',
    title: 'Clearly badged, never mixed in',
    body: 'A demonstration dataset is available so the interface can be explored before any field work is done. It lives in a separate namespace, is badged everywhere it appears, and can be wiped in one action.',
    cta: { to: '/dashboard', label: 'See the dashboard' },
  },
  {
    icon: SlidersHorizontal,
    tone: 'sage' as const,
    label: 'Your inputs',
    title: 'Never published as a fact',
    body: 'Material prices, tariffs and baseline power are entered by you from your own suppliers and your own meter. The calculator shows the arithmetic on those numbers and names every assumption behind it.',
    cta: { to: '/calculator', label: 'Open the calculator' },
  },
];

export function EvidencePolicy() {
  return (
    <section className="border-b border-line bg-forest-deep py-16 text-ivory-soft sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-3">
            <span className="font-display text-xs font-semibold tracking-[0.18em] text-solar uppercase">
              Where the numbers come from
            </span>
            <h2 className="max-w-3xl font-display text-3xl leading-[1.15] font-semibold text-ivory-soft sm:text-4xl">
              Three kinds of number. Only one of them is evidence.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-ivory-soft/70">
              A prototype that publishes invented results is worse than one that
              publishes nothing. This project separates the three kinds of
              number it can display and never lets them pass for each other.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {categories.map((item, index) => (
            <Reveal key={item.label} delay={index * 80}>
              <article className="flex h-full flex-col gap-4 rounded-card border border-ivory-soft/15 bg-ivory-soft/[0.06] p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-ivory-soft/10 text-solar">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <Badge
                    tone={
                      item.tone === 'forest'
                        ? 'sage'
                        : item.tone === 'solar'
                          ? 'solar'
                          : 'outline'
                    }
                    size="sm"
                    className={
                      item.tone === 'sage'
                        ? 'border-sage/40 bg-sage/15 text-sage'
                        : item.tone === 'solar'
                          ? 'border-solar/40 bg-solar/15 text-solar'
                          : 'border-ivory-soft/30 bg-transparent text-ivory-soft/70'
                    }
                  >
                    {item.label}
                  </Badge>
                </div>
                <h3 className="font-display text-lg font-semibold text-ivory-soft">
                  {item.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-ivory-soft/70">
                  {item.body}
                </p>
                <Link
                  to={item.cta.to}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-solar transition-colors hover:text-ivory-soft"
                >
                  {item.cta.label}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
