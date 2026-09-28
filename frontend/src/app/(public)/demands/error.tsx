// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Marketplace Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//   /demands
//
// Responsibilities:
// - present a recoverable error state for the public demand marketplace;
// - allow Next.js to retry rendering the failed route segment;
// - provide a compact, mobile-first error surface.
//
// Non-responsibilities:
// - no data fetching;
// - no query ownership;
// - no filtering;
// - no sorting;
// - no marketplace state management;
// - no manual error classification;
// - no API-specific error interpretation.
//
// Next.js requires error boundaries to be Client Components because the
// `reset` callback is supplied by the framework.
// -----------------------------------------------------------------------------

'use client';

import { ErrorState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandsErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function JourneyDemandsError({
  reset,
}: JourneyDemandsErrorProps) {
  return (
    <main
      className="page-shell"
      aria-labelledby="journey-demands-error-title"
    >
      <div className="page-container">
        <section className="flex min-h-[50vh] items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-lg">
            <ErrorState
              title="We couldn't load journey demands"
              description="Something went wrong while loading the journey marketplace. Please try again."
              retryAction={{
                label: 'Try again',
                onClick: reset,
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

