'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Management Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated Journey Demand management
// surface.
//
// Next.js supplies the error and reset callback. The page remains responsible
// for normal query and rendering states.
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

interface JourneyDemandsErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function JourneyDemandsError({
  error,
  reset,
}: JourneyDemandsErrorProps) {
  void error;

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <ErrorState
            title="Unable to load journey demands"
            description="Something went wrong while loading your journey demands. Please try again."
            onRetry={reset}
          />
        </section>
      </div>
    </div>
  );
}