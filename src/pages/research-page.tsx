import { Printer } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import {
  dataProcessingNotes,
  objectives,
  protocolSteps,
  referenceCaveat,
  references,
  researchQuestion,
  sensorPlacement,
  uncertaintyFactors,
} from '@/content/research';
import { projectLimitations } from '@/content/system';

export function ResearchPage() {
  return (
    <main id="main-content" className="print-page">
      <PageHeader
        eyebrow="Research and methodology"
        title="A protocol first. Results only from recorded rows."
        description={
          <p>
            This page is the experimental brief. Temperature reductions, energy savings and
            payback belong on the dashboard and calculator, derived from data you enter. They
            are not restated here as findings.
          </p>
        }
      >
        <Button
          variant="secondary"
          data-print="hide"
          onClick={() => window.print()}
        >
          <Printer /> Print or save as PDF
        </Button>
      </PageHeader>

      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <SectionHeading eyebrow="Research question" title={researchQuestion} />
        </section>

        <section>
          <SectionHeading eyebrow="Objectives" title="What the study is designed to answer." />
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {objectives.map((item, index) => (
              <li key={item.title} className="rounded-card border border-line bg-ivory-soft p-5">
                <p className="font-display text-xs font-semibold tracking-[0.16em] text-solar-deep uppercase">
                  Objective {index + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-forest">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionHeading
            eyebrow="Protocol"
            title="Keep baseline and system tests comparable."
          />
          <ol className="mt-8 flex flex-col gap-4">
            {protocolSteps.map((step) => (
              <li
                key={step.step}
                className="grid gap-3 rounded-card border border-line bg-ivory-soft p-5 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-display flex size-10 items-center justify-center rounded-full bg-forest text-sm font-bold text-ivory-soft">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Sensor placement" title="Fix the point. Photograph it." />
            <ul className="mt-6 flex flex-col gap-3">
              {sensorPlacement.map((item) => (
                <li key={item.location} className="rounded-card border border-line bg-ivory-soft p-4">
                  <p className="font-medium text-forest">{item.location}</p>
                  <p className="mt-1 text-sm text-charcoal-soft">{item.guidance}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Uncertainty" title="A mean without a count is not a result." />
            <ul className="mt-6 flex flex-col gap-3">
              {uncertaintyFactors.map((item) => (
                <li key={item.factor} className="rounded-card border border-line bg-ivory-soft p-4">
                  <p className="font-medium text-forest">{item.factor}</p>
                  <p className="mt-1 text-sm text-charcoal-soft">{item.handling}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Data processing"
            title="Paired rows only. Empty optional fields stay empty."
          />
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-charcoal-soft">
            {dataProcessingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading eyebrow="Limitations" title="What this study will not claim." />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {projectLimitations.map((item) => (
              <li key={item}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base font-medium leading-relaxed">
                      {item}
                    </CardTitle>
                  </CardHeader>
                  <CardContent />
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading eyebrow="References" title="Starting points for the literature review." />
          <Banner tone="info" title="Read the originals" className="mt-6">
            {referenceCaveat}
          </Banner>
          <ul className="mt-6 flex flex-col gap-3">
            {references.map((item) => (
              <li key={item.id} className="rounded-card border border-line bg-ivory-soft p-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-display font-semibold text-forest underline decoration-line-strong underline-offset-4 hover:decoration-forest"
                >
                  {item.label}
                </a>
                <p className="mt-1 text-xs font-medium tracking-wide text-charcoal-faint uppercase">
                  {item.organisation}
                </p>
                <p className="mt-2 text-sm text-charcoal-soft">{item.usedFor}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
