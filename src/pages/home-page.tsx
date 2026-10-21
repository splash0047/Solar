import { Hero } from './home/hero';
import { ProblemSolution } from './home/problem-solution';
import { ConceptSteps } from './home/concept-steps';
import { EvidencePolicy } from './home/evidence-policy';
import { SdgSection } from './home/sdg-section';

export function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <ProblemSolution />
      <ConceptSteps />
      <EvidencePolicy />
      <SdgSection />
    </main>
  );
}
