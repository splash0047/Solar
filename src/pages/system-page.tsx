import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HouseCrossSection } from '@/components/illustrations/house-cross-section';
import { HOTSPOTS } from '@/components/illustrations/hotspots';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal } from '@/components/layout/reveal';
import { Badge } from '@/components/ui/badge';
import { Banner } from '@/components/ui/banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { projectLimitations, systemComponents } from '@/content/system';
import { materialList } from '@/content/guidance';

export function SystemPage() {
  const [activeId, setActiveId] = React.useState<string>(systemComponents[0]!.id);
  const active =
    systemComponents.find((item) => item.id === activeId) ?? systemComponents[0]!;

  return (
    <main id="main-content">
      <PageHeader
        eyebrow="How it works"
        title="A layered envelope, not a single gadget."
        description="The concept stacks four techniques. Three are passive. One optional fan is active and solar-powered. They are not interchangeable, and each has conditions under which it does not help."
      />

      <section className="border-b border-line bg-ivory py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <Reveal>
            <div className="rounded-card border border-line bg-ivory-soft p-3 shadow-soft sm:p-5">
              <HouseCrossSection activeId={activeId} onSelect={setActiveId} />
              <p className="mt-3 px-2 text-xs leading-relaxed text-charcoal-faint">
                Conceptual schematic. Click a numbered hotspot or a card to inspect
                that component. This drawing is not a photograph of a built prototype.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-4">
              <p className="font-display text-xs font-semibold tracking-[0.16em] text-solar-deep uppercase">
                Selected component
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-semibold text-forest">
                  {active.name}
                </h2>
                <Badge tone={active.mode === 'passive' ? 'sage' : 'solar'}>
                  {active.mode === 'passive' ? 'Passive' : 'Active · uses electricity'}
                </Badge>
              </div>
              <p className="text-sm font-medium text-charcoal">{active.tagline}</p>
              <p className="text-sm leading-relaxed text-charcoal-soft">
                {active.mechanism}
              </p>
              <Banner tone="warning" title="Limitation">
                {active.limitation}
              </Banner>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-ivory-soft py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Components"
            title="What each part does, and what it cannot do."
            description="Select a component to highlight it on the schematic. Passive measures reduce heat gain or move air when outdoor conditions allow. The fan is the only part that draws power."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {systemComponents.map((item, index) => {
              const hotspot = HOTSPOTS.find((spot) => spot.id === item.id);
              const selected = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={selected}
                    className={`flex h-full w-full flex-col gap-3 rounded-card border p-5 text-left transition-colors ${
                      selected
                        ? 'border-forest bg-forest-soft/70 shadow-soft'
                        : 'border-line bg-ivory hover:border-sage-deep'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-forest text-sm font-semibold text-ivory-soft">
                        {index + 1}
                      </span>
                      <Badge tone={item.mode === 'passive' ? 'sage' : 'solar'} size="sm">
                        {item.mode}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-forest">
                      {item.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal-soft">
                      {item.tagline}
                    </p>
                    {hotspot ? (
                      <p className="text-xs text-charcoal-faint">
                        Diagram marker: {hotspot.label}
                      </p>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-b border-line bg-ivory py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Materials"
            title="What the build uses, without published prices."
            description="Unit prices vary by district and season. Enter supplier quotes in the calculator. Nothing here is a catalogue."
          />
          <div className="mt-10 overflow-hidden rounded-card border border-line bg-ivory-soft">
            <table className="w-full text-sm">
              <thead className="border-b border-line-strong bg-ivory-deep/70 text-left">
                <tr>
                  <th className="px-4 py-3 font-display text-xs tracking-wide text-charcoal-soft uppercase">
                    Material
                  </th>
                  <th className="hidden px-4 py-3 font-display text-xs tracking-wide text-charcoal-soft uppercase sm:table-cell">
                    Specification
                  </th>
                  <th className="px-4 py-3 font-display text-xs tracking-wide text-charcoal-soft uppercase">
                    Unit
                  </th>
                  <th className="px-4 py-3 font-display text-xs tracking-wide text-charcoal-soft uppercase">
                    Mode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {materialList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-forest">{item.name}</td>
                    <td className="hidden px-4 py-3 text-charcoal-soft sm:table-cell">
                      {item.specification}
                    </td>
                    <td className="px-4 py-3 text-charcoal">{item.unit}</td>
                    <td className="px-4 py-3">
                      <Badge tone={item.passive ? 'sage' : 'solar'} size="sm">
                        {item.passive ? 'Passive' : 'Active'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 font-medium text-forest underline decoration-line-strong underline-offset-4 hover:decoration-forest"
            >
              Enter local quotes and operating assumptions
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-ivory-soft py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Limits"
            title="Engineering claims stop where the physics stops."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {projectLimitations.map((item) => (
              <li key={item}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{item}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0" />
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
