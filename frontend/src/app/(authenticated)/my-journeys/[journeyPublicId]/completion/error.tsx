// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Route Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//   /journeys/[journeyPublicId]/completion
//
// Responsibilities:
// - present a recoverable route-level error;
// - allow Next.js to retry rendering the route;
// - provide a safe navigation path back to the user's journeys.
//
// Non-responsibilities:
// - interpreting backend/domain errors;
// - performing completion mutations;
// - deciding completion authorization;
// - deciding settlement state.
//
// The error boundary is intentionally generic because the underlying failure
// may originate from any of the page's independent authenticated queries.
// -----------------------------------------------------------------------------

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Card, Container, ErrorState } from '@/components/ui';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export interface JourneyCompletionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function JourneyCompletionError({
  error,
  reset,
}: JourneyCompletionErrorProps) {
  useEffect(() => {
    // Keep the error available to Next.js' development tooling and monitoring
    // integrations without exposing internal details to the user.
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section">
          <Card variant="default" padding="lg">
            <div className="flex flex-col gap-5">
              <ErrorState
                title="Unable to load journey completion"
                description="We could not load the completion details for this journey. Please try again."
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                >
                  Try again
                </button>

                <Link
                  href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
                  className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                >
                  Back to my journeys
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}