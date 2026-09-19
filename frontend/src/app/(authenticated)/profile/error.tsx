// -----------------------------------------------------------------------------
// sisiMove — Profile Route Error Boundary
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated profile page.
//
// Responsibilities:
// - Catch render/runtime errors within the /profile route.
// - Present the shared design-system ErrorState.
// - Allow the user to retry the failed route render.
// - Remain independent of profile-domain fetching and business logic.
//
// Non-responsibilities:
// - Fetch profile data.
// - Interpret domain errors.
// - Perform authentication.
// - Navigate to another profile/account route.
// - Expose internal error details to the user.
//
// Next.js requires this component to be a Client Component because the
// route-level error boundary receives the `reset` recovery function.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { ErrorState } from '@/components/ui/error-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProfileRouteErrorProps {
  /**
   * Error captured by the Next.js route boundary.
   *
   * The error is intentionally not rendered directly. Internal error details
   * should not leak into the authenticated UI.
   */
  error: Error & {
    digest?: string;
  };

  /**
   * Requests Next.js to attempt rendering the failed route again.
   */
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Profile Route Error
// -----------------------------------------------------------------------------

export default function ProfileRouteError({
  reset,
}: ProfileRouteErrorProps): ReactNode {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <ErrorState
        title="We could not load your profile"
        description="Something went wrong while loading your profile. Please try again."
        retryAction={{
          label: 'Try again',
          onClick: reset,
        }}
      />
    </main>
  );
}