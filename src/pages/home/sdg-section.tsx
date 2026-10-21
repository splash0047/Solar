import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { projectLimitations, sdgContributions } from '@/content/system';
import { Reveal } from '@/components/layout/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';

export function SdgSection() {
  return (
    <section className="border-b border-line bg-ivory-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="SDG 7"
            title="Cooling that does not add to the energy problem."
            description="Sustainable Development Goal 7 calls for affordable, reliable, sustainable and modern energy for all. A cooling system that reduces the electricity a household needs, and that powers its own active component from the roof, addresses that goal directly."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {sdgContributions.map((item, index) => (
            <Reveal key={item.code} delay={index * 80}>
              <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-ivory p-6 shadow-soft">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-control bg-solar-soft text-solar-deep">
                    <Zap className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl font-bold text-forest">
                    {item.code}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-forest">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-charcoal-soft">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeading
              eyebrow="Limitations"
              title="What this system cannot do."
              description="Stating these up front is part of the engineering. Each one is a condition the team has to test for rather than assume away."
            />
            <ul className="flex flex-col gap-3">
              {projectLimitations.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-card border border-line bg-ivory px-5 py-4"
                >
                  <Badge tone="outline" size="sm" className="mt-0.5 shrink-0">
                    Limit
                  </Badge>
                  <p className="text-sm leading-relaxed text-charcoal-soft">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-card border border-line bg-ivory p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-forest">
                Start with the method, not the marketing.
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal-soft">
                The research page sets out the full protocol, the sensor
                placement, the uncertainty handling and the references the
                project is built on.
              </p>
            </div>
            <Link
              to="/research"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-control bg-forest px-5 text-sm font-medium text-ivory-soft transition-colors hover:bg-forest-mid"
            >
              Read the methodology
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
