'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-onboarding.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Onboarding
//
// Dependency level: 4
//
// Workflow:
//
//     Verification
//          ↓
//     Verification Requests
//          ↓
//     Requirement Projection
//          ↓
//     Select requirement
//          ↓
//     Submit verification
//          ↓
//     Success acknowledgement
//          ↓
//     Reload verification state
//
// Responsibility
// --------------
// This is the feature-level verification onboarding workflow.
//
// It owns:
// - loading the authenticated user's Verification;
// - loading the Verification Requests belonging to that Verification;
// - projecting backend Verification + Request data into frontend
//   VerificationRequirement models;
// - starting Verification when none exists;
// - requirement selection;
// - composing verification status, requirements, and submission surfaces;
// - success acknowledgement state;
// - refreshing verification state after successful submission.
//
// It does NOT:
// - recreate backend verification rules;
// - calculate requirement lifecycle rules itself;
// - create Assets;
// - call verification request APIs directly;
// - cancel verification requests;
// - perform file validation;
// - implement its own modal primitive.
//
// Data ownership
// --------------
// This is the feature-level data/workflow boundary.
//
// The page intentionally remains thin and renders this component directly.
// This avoids loading the authenticated Verification twice:
//
//     VerificationPage
//          ↓
//     VerificationOnboarding
//          ├── useVerification()
//          ├── useVerificationRequests()
//          └── mapVerificationRequirements()
//
// Mutation ownership
// ------------------
// VerificationOnboarding owns the Verification creation workflow through
// useVerification().
//
// VerificationSubmit owns the verification-request submission mutation through
// useSubmitVerificationRequest().
//
// VerificationRequestActions owns request cancellation through its own mutation
// hook.
//
// SuccessModal is presentation-only. It does not perform navigation, mutation,
// or lifecycle decisions.
//
// Requirement projection
// ----------------------
// VerificationRequirement is a separate frontend model because its lifecycle
// contains states that cannot safely be inferred from Verification alone:
//
//     NOT_STARTED
//     PENDING
//     APPROVED
//     REJECTED
//     CANCELLED
//
// The requirement collection is therefore produced by the dedicated mapper:
//
//     Verification + VerificationRequest[]
//             ↓
//     mapVerificationRequirements()
//             ↓
//     VerificationRequirement[]
//
// Design system
// -------------
// All visual styling uses the frozen sisiMove design tokens.
// No arbitrary colors, gradients, or dark-mode styling are introduced.
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { SuccessModal } from '@/components/ui/success-modal';
import { cn } from '@/foundation';

import { useVerification } from '@/features/verification/hooks/use-verification';
import { useVerificationRequests } from '@/features/verification/hooks/use-verification-requests';
import { mapVerificationRequirements } from '@/features/verification/mappers/map-verification-requirements';
import type { VerificationRequirement } from '@/features/verification/models/verification-requirement';

import { VerificationRequirements } from './verification-requirements';
import { VerificationStatus } from './verification-status';
import { VerificationSubmit } from './verification-submit';

// =============================================================================
// Props
// =============================================================================

export interface VerificationOnboardingProps {
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function VerificationOnboarding({
  className,
}: VerificationOnboardingProps) {
  const {
    verification,
    isLoading: isVerificationLoading,
    isCreating,
    error: verificationError,
    reload,
    startVerification,
  } = useVerification();

  // ---------------------------------------------------------------------------
  // Verification requests
  // ---------------------------------------------------------------------------
  //
  // Requests cannot be loaded until the Verification public ID exists.
  //
  // useVerificationRequests() intentionally owns the request query rather than
  // making this workflow call the API directly.
  // ---------------------------------------------------------------------------

  const {
    requests,
    isLoading: areRequestsLoading,
    error: requestsError,
    reload: reloadRequests,
  } = useVerificationRequests(
    verification?.publicId ?? null,
  );

  // ---------------------------------------------------------------------------
  // Requirement projection
  // ---------------------------------------------------------------------------
  //
  // Requirement lifecycle state belongs to the mapper/data layer.
  //
  // This component only composes the already-defined projection for rendering.
  // It does not inspect request statuses or Verification booleans itself.
  // ---------------------------------------------------------------------------

  const requirements = useMemo<readonly VerificationRequirement[]>(
    () => {
      if (!verification) {
        return [];
      }

      return mapVerificationRequirements(
        verification,
        requests,
      );
    },
    [requests, verification],
  );

  // ---------------------------------------------------------------------------
  // Local workflow state
  // ---------------------------------------------------------------------------
  //
  // Selection belongs to this feature-level workflow because it determines
  // which requirement is currently being worked on.
  //
  // VerificationSubmit owns the actual submission mutation.
  // ---------------------------------------------------------------------------

  const [
    selectedRequirement,
    setSelectedRequirement,
  ] = useState<VerificationRequirement | null>(null);

  // ---------------------------------------------------------------------------
  // Success acknowledgement state
  // ---------------------------------------------------------------------------
  //
  // The success modal is deliberately controlled here rather than inside
  // VerificationSubmit.
  //
  // VerificationSubmit reports that the mutation succeeded.
  // This workflow decides how that success is acknowledged to the user.
  // ---------------------------------------------------------------------------

  const [
    isSuccessModalOpen,
    setIsSuccessModalOpen,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Requirement selection
  // ---------------------------------------------------------------------------

  const handleSelectRequirement = useCallback(
    (requirement: VerificationRequirement) => {
      setSelectedRequirement(requirement);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Verification submission success
  // ---------------------------------------------------------------------------
  //
  // VerificationSubmit owns the submission mutation.
  //
  // Once that mutation succeeds:
  // 1. close the selected submission surface;
  // 2. acknowledge success;
  // 3. reload Verification;
  // 4. reload Verification Requests.
  //
  // Reloading both sources is important because the requirement projection is
  // derived from both Verification and its request history.
  // ---------------------------------------------------------------------------

  const handleSubmitted = useCallback(() => {
    setSelectedRequirement(null);
    setIsSuccessModalOpen(true);

    void reload();
    void reloadRequests();
  }, [reload, reloadRequests]);

  // ---------------------------------------------------------------------------
  // Success acknowledgement close
  // ---------------------------------------------------------------------------

  const handleCloseSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Start Verification
  // ---------------------------------------------------------------------------
  //
  // Registration normally creates Verification already.
  //
  // This remains an explicit recovery action. Verification is never created
  // during render and is never created automatically through an effect.
  // ---------------------------------------------------------------------------

  const handleStartVerification = useCallback(async () => {
    try {
      await startVerification();

      /*
       * startVerification() updates the Verification state inside
       * useVerification(). Reload afterwards to obtain the authoritative
       * backend projection.
       */
      await reload();
    } catch {
      /*
       * useVerification owns and exposes the normalized error.
       *
       * The workflow deliberately does not duplicate API error handling here.
       */
    }
  }, [reload, startVerification]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  //
  // Verification must exist before the request collection can be queried.
  // ---------------------------------------------------------------------------

  if (isVerificationLoading) {
    return (
      <section
        aria-labelledby="verification-onboarding-loading-title"
        className={cn(
          'rounded-[var(--radius-xl)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-5',
          'shadow-[var(--shadow-sm)]',
          className,
        )}
      >
        <div className="mx-auto max-w-2xl">
          <h1
            id="verification-onboarding-loading-title"
            className="text-xl font-semibold text-[var(--foreground)]"
          >
            Get verified
          </h1>

          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Loading your verification status…
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Defensive recovery: Verification does not exist
  // ---------------------------------------------------------------------------
  //
  // Registration normally creates Verification already.
  //
  // This branch exists as an explicit recovery path rather than silently
  // creating Verification during render or through an effect.
  // ---------------------------------------------------------------------------

  if (!verification) {
    return (
      <>
        <section
          aria-labelledby="verification-onboarding-title"
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
            'shadow-[var(--shadow-sm)]',
            className,
          )}
        >
          <div className="mx-auto max-w-2xl space-y-5">
            <div>
              <h1
                id="verification-onboarding-title"
                className="text-xl font-semibold text-[var(--foreground)]"
              >
                Get verified
              </h1>

              <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                Complete your verification to build trust on sisiMove.
              </p>
            </div>

            {verificationError && (
              <div
                role="alert"
                className={cn(
                  'rounded-[var(--radius-md)]',
                  'border border-[var(--danger)]',
                  'bg-[var(--danger-soft)]',
                  'p-3',
                )}
              >
                <p className="text-sm text-[var(--danger)]">
                  {verificationError.message}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isCreating}
              onClick={() => {
                void handleStartVerification();
              }}
              className={cn(
                'inline-flex min-h-10 items-center justify-center',
                'rounded-[var(--radius-md)]',
                'border border-[var(--brand)]',
                'bg-[var(--brand)]',
                'px-4 py-2',
                'text-sm font-medium',
                'text-[var(--brand-foreground)]',
                'shadow-[var(--shadow-sm)]',
                'transition-colors',
                'hover:bg-[var(--brand-hover)]',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-2',
                'disabled:cursor-not-allowed',
                'disabled:opacity-60',
              )}
            >
              {isCreating ? 'Starting…' : 'Start verification'}
            </button>
          </div>
        </section>

        <SuccessModal
          open={isSuccessModalOpen}
          title="Verification submitted"
          description="Your verification information has been submitted successfully."
          onClose={handleCloseSuccessModal}
        />
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Request loading
  // ---------------------------------------------------------------------------
  //
  // Verification exists, but its request collection is still loading.
  // Do not render an incomplete requirement projection as though it were
  // authoritative.
  // ---------------------------------------------------------------------------

  if (areRequestsLoading) {
    return (
      <section
        aria-labelledby="verification-onboarding-requests-loading-title"
        className={cn(
          'rounded-[var(--radius-xl)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-5',
          'shadow-[var(--shadow-sm)]',
          className,
        )}
      >
        <div className="mx-auto max-w-3xl">
          <h1
            id="verification-onboarding-requests-loading-title"
            className="text-xl font-semibold text-[var(--foreground)]"
          >
            Get verified
          </h1>

          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Loading your verification requirements…
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Request error
  // ---------------------------------------------------------------------------
  //
  // The Verification object is available, but the request collection required
  // to construct the requirement lifecycle projection could not be loaded.
  //
  // Do not silently treat this as NOT_STARTED.
  // ---------------------------------------------------------------------------

  if (requestsError) {
    return (
      <section
        aria-labelledby="verification-onboarding-requests-error-title"
        className={cn(
          'rounded-[var(--radius-xl)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'p-5',
          'shadow-[var(--shadow-sm)]',
          className,
        )}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <div>
            <h1
              id="verification-onboarding-requests-error-title"
              className="text-xl font-semibold text-[var(--foreground)]"
            >
              Get verified
            </h1>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              We could not load your verification requirements.
            </p>
          </div>

          <div
            role="alert"
            className={cn(
              'rounded-[var(--radius-md)]',
              'border border-[var(--danger)]',
              'bg-[var(--danger-soft)]',
              'p-3',
            )}
          >
            <p className="text-sm text-[var(--danger)]">
              {requestsError.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void reloadRequests();
            }}
            className={cn(
              'inline-flex min-h-10 items-center justify-center',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-4 py-2',
              'text-sm font-medium',
              'text-[var(--foreground)]',
              'shadow-[var(--shadow-sm)]',
              'transition-colors',
              'hover:bg-[var(--surface-muted)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            )}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Main onboarding workflow
  // ---------------------------------------------------------------------------

  return (
    <>
      <section
        aria-labelledby="verification-onboarding-title"
        className={cn(
          'space-y-5',
          className,
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Verification overview                                             */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
            'shadow-[var(--shadow-sm)]',
          )}
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-5">
              <h1
                id="verification-onboarding-title"
                className="text-xl font-semibold text-[var(--foreground)]"
              >
                Get verified
              </h1>

              <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                Complete the verification requirements below to build your
                sisiMove trust profile.
              </p>
            </div>

            <VerificationStatus verification={verification} />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Requirements                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
            'shadow-[var(--shadow-sm)]',
          )}
        >
          <div className="mx-auto max-w-3xl space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Verification requirements
              </h2>

              <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                Select a requirement to submit the information requested for
                verification.
              </p>
            </div>

            <VerificationRequirements
              requirements={requirements}
              onSelect={handleSelectRequirement}
            />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Selected requirement submission                                    */}
        {/* ----------------------------------------------------------------- */}

        {selectedRequirement && (
          <VerificationSubmit
            /*
             * Remount when the selected requirement type changes.
             *
             * This resets the file input naturally without synchronising
             * local state through a useEffect.
             */
            key={selectedRequirement.type}
            requirement={selectedRequirement}
            onSubmitted={handleSubmitted}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Verification workflow error                                       */}
        {/* ----------------------------------------------------------------- */}

        {verificationError && (
          <div
            role="alert"
            className={cn(
              'rounded-[var(--radius-md)]',
              'border border-[var(--danger)]',
              'bg-[var(--danger-soft)]',
              'p-3',
            )}
          >
            <p className="text-sm text-[var(--danger)]">
              {verificationError.message}
            </p>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Verification submission success                                     */}
      {/* ------------------------------------------------------------------- */}

      <SuccessModal
        open={isSuccessModalOpen}
        title="Verification submitted"
        description="Your verification information has been submitted successfully. We’ll update your verification status after review."
        onClose={handleCloseSuccessModal}
      />
    </>
  );
}
