'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary for the authenticated Support surface.
//
// Responsibilities:
// - present a safe, member-facing route error;
// - provide route recovery through Next.js reset();
// - reuse the shared sisiMove ErrorState design-system primitive.
//
// Non-responsibilities:
// - exposing backend error details;
// - interpreting Support domain errors;
// - performing Support mutations;
// - managing authentication;
// - replacing query-level error handling.
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
          description="We could not load this Support page. Please try again."
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

