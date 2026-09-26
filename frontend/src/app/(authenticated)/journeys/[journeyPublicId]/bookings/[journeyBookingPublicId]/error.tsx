// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Detail Error State
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//   /bookings/[journeyBookingPublicId]
//
// Responsibilities:
// - Present a recoverable error state when the route encounters an unexpected
//   rendering/runtime error.
// - Allow the user to retry the failed route segment.
// - Provide a safe navigation path back to the user's booking list.
//
// Non-responsibilities:
// - Interpreting API/domain errors as booking lifecycle states.
// - Performing booking mutations.
// - Fetching the booking directly.
// - Logging or transforming the underlying error.
//
// Next.js requires this component to be a Client Component because the error
// boundary receives the runtime `error` object and `reset` callback.
// -----------------------------------------------------------------------------

'use client';

import { useRouter } from 'next/navigation';

import { Button, Card } from '@/components/ui';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface JourneyBookingDetailErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function JourneyBookingDetailError({
  error,
  reset,
}: JourneyBookingDetailErrorProps) {
  const router = useRouter();

  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="mx-auto max-w-2xl">
            <Card padding="lg">
              <div className="flex flex-col items-center text-center">
                {/* -----------------------------------------------------------
                    Error indicator
                   ----------------------------------------------------------- */}

                <div
                  aria-hidden="true"
                  className={[
                    'flex',
                    'h-12',
                    'w-12',
                    'items-center',
                    'justify-center',
                    'rounded-[var(--radius-full)]',
                    'bg-[var(--danger-soft)]',
                    'text-[var(--danger)]',
                  ].join(' ')}
                >
                  <span className="text-lg font-semibold">!</span>
                </div>

                {/* -----------------------------------------------------------
                    Message
                   ----------------------------------------------------------- */}

                <h1 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  We couldn&apos;t load this booking
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-secondary)]">
                  Something went wrong while loading the booking details.
                  Please try again or return to your bookings.
                </p>

                {/* -----------------------------------------------------------
                    Development diagnostics
                   -----------------------------------------------------------

                    The underlying error must not be exposed to production
                    users. During development it is useful for diagnosing
                    route/rendering failures without introducing a separate
                    logging or error-inspection abstraction here.
                   ----------------------------------------------------------- */}

                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 w-full rounded-[var(--radius-md)] bg-[var(--background-muted)] p-3 text-left">
                    <summary className="cursor-pointer text-xs font-medium text-[var(--foreground-secondary)]">
                      Technical details
                    </summary>

                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-[var(--foreground-muted)]">
                      {error.message}
                    </pre>

                    {error.digest && (
                      <p className="mt-2 break-all font-mono text-[10px] text-[var(--foreground-subtle)]">
                        Digest: {error.digest}
                      </p>
                    )}
                  </details>
                )}

                {/* -----------------------------------------------------------
                    Recovery actions
                   ----------------------------------------------------------- */}

                <div className="mt-6 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={reset}
                  >
                    Try again
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      router.push(AUTHENTICATED_ROUTES.MY_BOOKINGS)
                    }
                  >
                    Back to bookings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}