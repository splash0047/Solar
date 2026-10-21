import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, Ruler, FlaskConical } from 'lucide-react';
import { HouseCrossSection } from '@/components/illustrations/house-cross-section';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ivory">
      <div
        aria-hidden="true"
        className="grid-paper pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-solar/12 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8">
        <div>
          <Badge tone="solar" size="sm">
            <span className="inline-block size-1.5 rounded-full bg-solar-deep" />
            UN SDG 7 · Affordable and clean energy
          </Badge>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-bold text-forest sm:text-6xl lg:text-[4.1rem]">
            Cooling a rural house
            <span className="block text-solar-deep">without the power bill.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-soft">
            SolarCool Rural documents the development of a low-cost,
            solar-assisted passive cooling system for rural houses and
            workshops — and publishes the experimental record behind it, so
            every claim can be traced to a measurement.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-control bg-forest px-7 text-[0.9375rem] font-medium text-ivory-soft shadow-soft transition-all hover:bg-forest-mid hover:shadow-lift"
            >
              Open the experiment dashboard
              <ArrowRight className="size-[1.125rem]" aria-hidden="true" />
            </Link>
            <Link
              to="/system"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-control border border-line-strong bg-ivory-soft px-7 text-[0.9375rem] font-medium text-forest transition-colors hover:border-forest"
            >
              See how the system works
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              { icon: FlaskConical, label: 'Paired measurement', detail: 'Baseline vs. system, row by row' },
              { icon: LineChart, label: 'Transparent stats', detail: 'Counts and exclusions shown' },
              { icon: Ruler, label: 'Local inputs', detail: 'Your prices, your tariff' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <item.icon
                  className="size-4 text-solar-deep"
                  aria-hidden="true"
                />
                <dt className="font-display text-[0.8125rem] font-semibold text-forest">
                  {item.label}
                </dt>
                <dd className="text-xs leading-relaxed text-charcoal-faint">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative">
          <div className="overflow-hidden rounded-card border border-line bg-ivory-soft shadow-lift">
            <HouseCrossSection idPrefix="hero" />
          </div>
          <figcaption className="mt-3 flex items-center gap-2 text-xs text-charcoal-faint">
            <Badge tone="outline" size="sm">
              Conceptual
            </Badge>
            Schematic of the design intent. It is not a photograph of a built
            prototype.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
