import { CircleAlert, Check } from 'lucide-react';
import { problemStatements, solutionStatements } from '@/content/system';
import { Reveal } from '@/components/layout/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

export function ProblemSolution() {
  return (
    <section className="border-b border-line bg-ivory-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="Rural rooms overheat long before the power grid does."
            description="Heat builds up inside uninsulated single-storey buildings with little thermal mass. The instinctive fix is an air conditioner, which solves the symptom at a recurring cost that many rural households cannot carry."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problemStatements.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-ivory p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-danger-soft text-danger">
                  <CircleAlert className="size-4.5" aria-hidden="true" />
                </span>
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
          <div className="mt-20">
            <SectionHeading
              eyebrow="The approach"
              title="Three moves, in order of cost."
              description="Each move is judged on its own merits, and each one is something the team can measure rather than assert."
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {solutionStatements.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-ivory p-6 shadow-soft">
                <span className="flex size-9 items-center justify-center rounded-full bg-success-soft text-success">
                  <Check className="size-4.5" aria-hidden="true" />
                </span>
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
      </div>
    </section>
  );
}
