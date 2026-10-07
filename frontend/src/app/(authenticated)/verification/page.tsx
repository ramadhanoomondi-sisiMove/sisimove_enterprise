// -----------------------------------------------------------------------------
// Path: src/app/(authenticated)/verification/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Onboarding Page
//
// Route:
//
//     /verification
//
// Responsibilities:
//
// - compose the authenticated verification workflow;
// - load the current user's verification;
// - load the verification requests belonging to that verification;
// - project the read models into VerificationRequirement[];
// - render VerificationOnboarding.
//
// Non-responsibilities:
//
// - no mutation orchestration;
// - no file upload;
// - no verification business rules;
// - no navigation decisions;
// - no authentication implementation;
// - no API calls directly from the route.
//
// Mutations remain owned by the workflow components:
//
//     VerificationSubmit
//          └── useSubmitVerificationRequest()
//
//     VerificationRequestActions
//          └── useCancelVerificationRequest()
//
// The page is therefore a composition boundary, not a workflow controller.
//
// -----------------------------------------------------------------------------


'use client';


// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useMemo } from 'react';


// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '@/foundation';


// -----------------------------------------------------------------------------
// Verification — Hooks
// -----------------------------------------------------------------------------

import {
  useVerification,
  useVerificationRequests,
} from '@/features/verification/hooks';


// -----------------------------------------------------------------------------
// Verification — Mapper
// -----------------------------------------------------------------------------

import {
  mapVerificationRequirements,
} from '@/features/verification/mappers/map-verification-requirements';


// -----------------------------------------------------------------------------
// Verification — Components
// -----------------------------------------------------------------------------

import {
  VerificationOnboarding,
} from '@/components/verification/onboarding/verification-onboarding';


// =============================================================================
// Page
// =============================================================================

export default function VerificationPage() {
  // ===========================================================================
  // Current Verification
  // ===========================================================================
  //
  // No verificationPublicId is supplied.
  //
  // useVerification() therefore calls:
  //
  //     GET /verifications/me
  //
  // The backend resolves the authenticated Identity from the access token.
  //
  // ---------------------------------------------------------------------------

  const {
    verification,
    isLoading: isVerificationLoading,
    error: verificationError,
  } = useVerification();


  // ===========================================================================
  // Verification Requests
  // ===========================================================================
  //
  // Requests are loaded only once the verification public ID is available.
  //
  // ---------------------------------------------------------------------------

  const {
    requests,
    isLoading: areRequestsLoading,
    error: requestsError,
  } = useVerificationRequests(
    verification?.publicId ?? null,
  );


  // ===========================================================================
  // Requirement Projection
  // ===========================================================================
  //
  // VerificationRequirement[] is a presentation projection of the two
  // authoritative frontend read models:
  //
  //     Verification
  //     VerificationRequest[]
  //
  // No verification rules are recreated here.
  //
  // ---------------------------------------------------------------------------

  const requirements = useMemo(() => {
    if (verification === null) {
      return [];
    }

    return mapVerificationRequirements(
      verification,
      requests,
    );
  }, [verification, requests]);


  // ===========================================================================
  // Loading
  // ===========================================================================

  if (
    isVerificationLoading ||
    (verification !== null && areRequestsLoading)
  ) {
    return (
      <main
        className={cn(
          'page-container',
          'py-6',
          'sm:py-8',
        )}
      >
        <section
          aria-busy="true"
          aria-label="Loading verification"
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
            'shadow-[var(--shadow-sm)]',
            'sm:p-6',
          )}
        >
          <div
            className={cn(
              'h-5',
              'w-48',
              'animate-pulse',
              'rounded-[var(--radius-sm)]',
              'bg-[var(--background-muted)]',
            )}
          />

          <div
            className={cn(
              'mt-3',
              'h-4',
              'max-w-xl',
              'animate-pulse',
              'rounded-[var(--radius-sm)]',
              'bg-[var(--background-muted)]',
            )}
          />

          <div
            className={cn(
              'mt-6',
              'space-y-3',
            )}
          >
            <div
              className={cn(
                'h-20',
                'animate-pulse',
                'rounded-[var(--radius-lg)]',
                'bg-[var(--background-subtle)]',
              )}
            />

            <div
              className={cn(
                'h-20',
                'animate-pulse',
                'rounded-[var(--radius-lg)]',
                'bg-[var(--background-subtle)]',
              )}
            />

            <div
              className={cn(
                'h-20',
                'animate-pulse',
                'rounded-[var(--radius-lg)]',
                'bg-[var(--background-subtle)]',
              )}
            />
          </div>
        </section>
      </main>
    );
  }


  // ===========================================================================
  // Read Error
  // ===========================================================================

  if (verificationError !== null) {
    return (
      <main
        className={cn(
          'page-container',
          'py-6',
          'sm:py-8',
        )}
      >
        <section
          role="alert"
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--danger-soft)]',
            'p-5',
            'sm:p-6',
          )}
        >
          <h1
            className={cn(
              'text-base',
              'font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            Unable to load verification
          </h1>

          <p
            className={cn(
              'mt-1',
              'text-sm',
              'leading-5',
              'text-[var(--foreground-secondary)]',
            )}
          >
            {verificationError.message}
          </p>
        </section>
      </main>
    );
  }


  // ===========================================================================
  // Exceptional Missing Verification
  // ===========================================================================
  //
  // Registration normally creates Verification.
  //
  // If the authenticated read nevertheless returns no verification, the
  // onboarding component owns the recovery action through useVerification().
  //
  // The page therefore does not create verification itself.
  //
  // ---------------------------------------------------------------------------

  if (verification === null) {
    return (
      <main
        className={cn(
          'page-container',
          'py-6',
          'sm:py-8',
        )}
      >
       <VerificationOnboarding />
      </main>
    );
  }


  // ===========================================================================
  // Request Read Error
  // ===========================================================================
  //
  // Verification itself is available, but its request collection could not be
  // loaded. Do not render an empty requirement state because that would make
  // an unavailable request collection look like NOT_STARTED requirements.
  //
  // ---------------------------------------------------------------------------

  if (requestsError !== null) {
    return (
      <main
        className={cn(
          'page-container',
          'py-6',
          'sm:py-8',
        )}
      >
        <section
          role="alert"
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--danger-soft)]',
            'p-5',
            'sm:p-6',
          )}
        >
          <h1
            className={cn(
              'text-base',
              'font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            Unable to load verification requests
          </h1>

          <p
            className={cn(
              'mt-1',
              'text-sm',
              'leading-5',
              'text-[var(--foreground-secondary)]',
            )}
          >
            {requestsError.message}
          </p>
        </section>
      </main>
    );
  }


  // ===========================================================================
  // Verification Workflow
  // ===========================================================================

  return (
    <main
      className={cn(
        'page-container',
        'py-6',
        'sm:py-8',
      )}
    >
    <VerificationOnboarding />
    </main>
  );
}

