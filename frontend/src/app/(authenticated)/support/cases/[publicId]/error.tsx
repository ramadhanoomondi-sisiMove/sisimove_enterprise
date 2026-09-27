'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Case Detail Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js error boundary for:
//
//   /support/cases/[publicId]
//
// Responsibilities:
// - provide a safe member-facing failure state;
// - allow the route segment to retry.
//
// Non-responsibilities:
// - exposing backend/API error details;
// - fetching the Support case;
// - deciding Support authorization;
// - resolving referenced domain entities.
//
// -----------------------------------------------------------------------------

import { ErrorState } from '@/components/ui';

export default function Error({
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <main className="page-container py-6">
      <div className="mx-auto w-full max-w-3xl">
        <ErrorState
          title="Support case is temporarily unavailable"
          description="We could not load this support case. Please try again."
          retryAction={{
            label: 'Try again',
            onClick: reset,
            variant: 'primary',
          }}
        />
      </div>
    </main>
  );
}

