// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Error Boundary
// -----------------------------------------------------------------------------
//
// Route-segment error boundary for:
//
//   /my-demands/new
//
// Next.js requires this component to be a Client Component because the
// boundary receives the `reset` recovery function.
//
// This boundary owns route-level error presentation and recovery only.
// Journey Demand creation errors remain owned by the feature/application
// layer when a submission is eventually connected.
//
// Non-responsibilities:
// - no Journey Demand creation;
// - no API requests;
// - no form state;
// - no validation;
// - no authentication logic;
// - no business-state derivation.
// -----------------------------------------------------------------------------

'use client';

import { ErrorState } from '@/components/ui';

interface NewJourneyDemandErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

export default function NewJourneyDemandError({
  error,
  reset,
}: NewJourneyDemandErrorProps) {
  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="mx-auto w-full max-w-2xl">
          <ErrorState
            title="Unable to open journey demand creation"
            description={
              error.message ||
              'Something went wrong while opening the Journey Demand creation flow.'
            }
            retryAction={{
              label: 'Try again',
              onClick: reset,
            }}
          />
        </div>
      </div>
    </main>
  );
}

