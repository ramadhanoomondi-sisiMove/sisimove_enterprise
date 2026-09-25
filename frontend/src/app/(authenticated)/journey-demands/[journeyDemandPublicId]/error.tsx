'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated Journey Demand detail
// surface.
//
// Next.js supplies the error and reset callback. The detail container remains
// responsible for normal data-loading and component-level error states.
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

interface JourneyDemandDetailErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function JourneyDemandDetailError({
  error,
  reset,
}: JourneyDemandDetailErrorProps) {
  void error;

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <ErrorState
            title="Unable to load journey demand"
            description="Something went wrong while loading this journey demand. Please try again."
            onRetry={reset}
          />
        </section>
      </div>
    </div>
  );
}