'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the Journey Demand creation entry point.
//
// This handles failures that occur while entering the creation workflow,
// including failure to initialize the server-side DRAFT.
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

interface JourneyDemandCreateErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function JourneyDemandCreateError({
  error,
  reset,
}: JourneyDemandCreateErrorProps) {
  void error;

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="mx-auto w-full max-w-3xl">
            <ErrorState
              title="Unable to start journey demand"
              description="Something went wrong while starting your journey demand. Please try again."
              onRetry={reset}
            />
          </div>
        </section>
      </div>
    </div>
  );
}