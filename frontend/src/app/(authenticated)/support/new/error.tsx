'use client';

// -----------------------------------------------------------------------------
// sisiMove — New Support Case Route Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js error boundary for:
//
//   /support/new
//
// Responsibilities:
// - provide a safe member-facing failure state;
// - allow the route segment to retry.
//
// Non-responsibilities:
// - exposing backend error details;
// - inspecting API errors;
// - performing Support mutations;
// - resolving authentication state.
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
          title="Support is temporarily unavailable"
          description="We could not load the information required to contact support. Please try again."
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
