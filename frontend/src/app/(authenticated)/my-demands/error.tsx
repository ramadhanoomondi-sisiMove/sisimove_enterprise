// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Error Boundary
// -----------------------------------------------------------------------------
//
// Route-segment error boundary for:
//
//   /my-demands
//
// Next.js requires this component to be a Client Component because the
// boundary receives the `reset` recovery function.
//
// The feature/query layer owns the actual request error. This boundary owns
// the route-level presentation and recovery action.
//
// Non-responsibilities:
// - no data fetching;
// - no error transformation;
// - no authentication logic;
// - no Journey Demand business-state logic.
// -----------------------------------------------------------------------------

'use client';

import { ErrorState } from '@/components/ui';

interface MyJourneyDemandsErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

export default function MyJourneyDemandsError({
  error,
  reset,
}: MyJourneyDemandsErrorProps) {
  return (
    <main className="page-shell">
      <div className="page-container">
        <ErrorState
          title="Unable to load your travel needs"
          description={
            error.message ||
            'Something went wrong while loading your Journey Demands.'
          }
          retryAction={{
            label: 'Try again',
            onClick: reset,
          }}
        />
      </div>
    </main>
  );
}

