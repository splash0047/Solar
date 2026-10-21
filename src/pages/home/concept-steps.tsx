import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { coolingSteps } from '@/content/system';
import { Reveal } from '@/components/layout/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

export function ConceptSteps() {
  return (
    <section className="border-b border-line bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The concept"
            title="Four steps from hot roof to cooler room."
            description="The order matters. Each step changes the conditions the next one depends on, so the sequence is part of the design rather than a list of features."
          />
        </Reveal>

        <ol className="mt-12 grid gap-5 lg:grid-cols-2">
          {coolingSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 70}>
              <li className="group flex h-full gap-5 rounded-card border border-line bg-ivory-soft p-6 transition-colors hover:border-sage-deep">
                <span className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-forest text-base font-bold text-ivory-soft transition-colors group-hover:bg-forest-mid">
                  {step.step}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-base font-semibold text-forest">
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium text-charcoal">
                    {step.summary}
                  </p>
                  <p className="text-sm leading-relaxed text-charcoal-soft">
                    {step.detail}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="mt-10">
            <Link
              to="/system"
              className="inline-flex items-center gap-2 font-medium text-forest underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-forest"
            >
              Explore each component, its limits and what it costs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
