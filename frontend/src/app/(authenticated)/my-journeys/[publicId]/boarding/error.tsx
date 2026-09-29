'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//     /journeys/[journeyPublicId]/boarding
//
// Responsibilities:
// - Present a stable user-facing error state.
// - Allow the user to retry the failed route segment.
// - Provide a safe navigation path back to My Journeys.
//
// This component intentionally does NOT:
// - inspect authentication state,
// - interpret backend domain errors,
// - perform boarding mutations,
// - expose internal exception details,
// - duplicate Journey Boarding business rules.
//
// Next.js requires route error boundaries to be client components.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Button,
  Container,
  ErrorState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface JourneyBoardingErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Error Boundary
// -----------------------------------------------------------------------------

export default function JourneyBoardingError({
  reset,
}: JourneyBoardingErrorProps) {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section">
          <ErrorState
            title="Unable to load boarding"
            description="Something went wrong while loading the boarding information for this journey. Please try again."
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={reset}
            >
              Try again
            </Button>

            <Link
              href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
              className={[
                'inline-flex min-h-9 items-center justify-center',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border)]',
                'bg-[var(--background)]',
                'px-3 text-sm font-medium',
                'text-[var(--foreground)]',
                'transition-colors',
                'hover:bg-[var(--background-subtle)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Back to my journeys
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}