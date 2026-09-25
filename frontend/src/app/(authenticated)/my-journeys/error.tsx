// -----------------------------------------------------------------------------
// sisiMove — My Journeys Route Error
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary for:
//
//     /my-journeys
//
// Responsibilities:
// - Catch rendering/runtime errors within the route segment.
// - Provide a safe recovery action.
// - Keep the error surface within the authenticated page geometry.
//
// Non-responsibilities:
// - Journey API error presentation.
// - Query-state handling.
// - Journey lifecycle logic.
// - Navigation business rules.
//
// API/query failures are handled by MyJourneysErrorState inside the page.
// This boundary is specifically for errors that escape the page component.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React / Next.js
// -----------------------------------------------------------------------------

import {
  useEffect,
} from 'react';

import {
  AlertCircle,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Shared UI
// -----------------------------------------------------------------------------

import {
  Button,
} from '@/components/ui';

// =============================================================================
// Props
// =============================================================================

interface MyJourneysErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

// =============================================================================
// Error Boundary
// =============================================================================

export default function MyJourneysError({
  error,
  reset,
}: MyJourneysErrorProps) {
  // ---------------------------------------------------------------------------
  // Error reporting hook
  // ---------------------------------------------------------------------------
  //
  // Keep this boundary ready for application-level error reporting without
  // coupling the route to a particular monitoring provider.
  //
  // ---------------------------------------------------------------------------

  useEffect(() => {
    console.error(
      'sisiMove — My Journeys route error',
      error,
    );
  }, [error]);

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex min-h-[20rem] items-center justify-center">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
                <AlertCircle
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <h1 className="text-lg font-semibold text-[var(--foreground)]">
                Something went wrong
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
                We could not load the My Journeys page. Please try again.
              </p>

              <div className="mt-5">
                <Button
                  type="button"
                  variant="primary"
                  onClick={reset}
                >
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}