import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';

export function NotFoundPage() {
  return (
    <main id="main-content">
      <PageHeader
        eyebrow="404"
        title="This page is not part of SolarCool Rural."
        description="The address does not match Home, System, Dashboard, Calculator, Guide or Research."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Route not found"
          description="Use the navigation to continue. No experimental data was changed."
          action={
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-control bg-forest px-4 text-sm font-medium text-ivory-soft"
            >
              Back to home
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
      </div>
    </main>
  );
}
