// -----------------------------------------------------------------------------
// sisiMove — Create Journey Route Error
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary for:
//
//     /journeys/create
//
// Responsibilities:
// - Catch rendering/runtime errors within the Journey creation entry route.
// - Provide a safe recovery action.
// - Keep the error surface within the authenticated page geometry.
//
// The Journey creation page handles expected draft-creation failures itself.
// This boundary handles errors that escape the page component.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
} from 'react';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

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

interface CreateJourneyErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

// =============================================================================
// Error Boundary
// =============================================================================

export default function CreateJourneyError({
  error,
  reset,
}: CreateJourneyErrorProps) {
  useEffect(() => {
    console.error(
      'sisiMove — Create Journey route error',
      error,
    );
  }, [error]);

  return (
    <main className="w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto flex min-h-[24rem] w-full max-w-md items-center justify-center">
          <div className="w-full text-center">
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
              We could not start the Journey creation flow. Please try again.
            </p>

            <div className="mt-5 flex justify-center">
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
    </main>
  );
}