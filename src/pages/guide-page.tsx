import { PageHeader } from '@/components/layout/page-header';
import { Reveal } from '@/components/layout/reveal';
import { Badge } from '@/components/ui/badge';
import { Banner } from '@/components/ui/banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import {
  constructionSequence,
  maintenanceChecklist,
  materialList,
  safetyConsiderations,
  suitabilityNotes,
} from '@/content/guidance';
import { Link } from 'react-router-dom';

export function GuidePage() {
  return (
    <main id="main-content">
      <PageHeader
        eyebrow="Implementation guide"
        title="Build in sequence, then inspect what you built."
        description="This is a construction and maintenance brief, not a certified installation manual. Structural, electrical and roof-work decisions need a qualified person where the site requires it."
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        <Banner tone="warning" title="Prices belong in the calculator">
          The material list describes what to buy and why. Enter local quotes on the{' '}
          <Link to="/calculator" className="font-medium text-forest underline">
            cost page
          </Link>
          . No catalogue prices are published here.
        </Banner>

        <section>
          <SectionHeading
            eyebrow="Materials"
            title="Passive layers first, active kit only if it is part of the prototype."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {materialList.map((item, index) => (
              <Reveal key={item.id} delay={index * 40} as="li">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Badge tone={item.passive ? 'sage' : 'solar'} size="sm">
                        {item.passive ? 'Passive' : 'Active'}
                      </Badge>
                    </div>
                    <CardDescription>{item.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-charcoal-soft">
                    <p>{item.specification}</p>
                    <p className="mt-2 text-xs text-charcoal-faint">Purchased by {item.unit}.</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            eyebrow="Construction sequence"
            title="Do not close a cavity you have not inspected."
          />
          <ol className="mt-8 flex flex-col gap-5">
            {constructionSequence.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-4 rounded-card border border-line bg-ivory-soft p-5 sm:grid-cols-[8rem_1fr] sm:p-6"
              >
                <div>
                  <p className="font-display text-xs font-semibold tracking-[0.16em] text-solar-deep uppercase">
                    {step.phase}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-forest">
                    {index + 1}. {step.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-charcoal-soft">{step.detail}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-charcoal">
                    {step.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionHeading
            eyebrow="Inspection and maintenance"
            title="A blocked opening silently cancels the design."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {maintenanceChecklist.map((item) => (
              <li key={item.id} className="rounded-card border border-line bg-ivory-soft p-5">
                <p className="font-display font-semibold text-forest">{item.title}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-solar-deep uppercase">
                  {item.frequency}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Suitability" title="Match the house before you cut the roof." />
            <ul className="mt-6 flex flex-col gap-4">
              {suitabilityNotes.map((item) => (
                <li key={item.title} className="rounded-card border border-line bg-ivory-soft p-5">
                  <p className="font-display font-semibold text-forest">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Safety" title="Roof work and live PV wiring are not classroom tasks." />
            <ul className="mt-6 flex flex-col gap-4">
              {safetyConsiderations.map((item) => (
                <li key={item.title} className="rounded-card border border-line bg-ivory-soft p-5">
                  <p className="font-display font-semibold text-forest">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
