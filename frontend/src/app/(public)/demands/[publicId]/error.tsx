// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//   /demands/[publicId]
//
// Responsibilities:
// - present a recoverable error state for the public demand detail route;
// - allow Next.js to retry rendering the failed route segment.
//
// Non-responsibilities:
// - no data fetching;
// - no query ownership;
// - no API-specific error classification;
// - no navigation construction;
// - no mutation handling;
// - no lifecycle interpretation.
//
// -----------------------------------------------------------------------------

'use client';

import { ErrorState } from '@/components/ui';

interface JourneyDemandDetailErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

export default function JourneyDemandDetailError({
  error,
  reset,
}: JourneyDemandDetailErrorProps) {
  void error;

  return (
    <main
      className="page-shell"
      aria-labelledby="journey-demand-detail-error-title"
    >
      <div className="page-container">
        <section className="flex min-h-[50vh] items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-lg">
            <ErrorState
              title="We couldn't load this journey demand"
              description="Something went wrong while loading this demand. Please try again."
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

