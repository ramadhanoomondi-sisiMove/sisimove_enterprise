
'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-onboarding.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Onboarding
//
// Dependency level: 4
//
// Responsibility
// --------------
// Feature-level verification onboarding workflow.
//
// It owns:
// - loading authenticated Verification;
// - loading Verification Requests;
// - projecting requirements;
// - starting Verification when none exists;
// - requirement selection;
// - composing verification status and requirements;
// - placing submission directly beneath the selected requirement;
// - success acknowledgement;
// - refreshing verification state after successful submission.
//
// Mutation ownership
// ------------------
// VerificationSubmit owns verification-request submission.
//
// VerificationOnboarding owns selection, acknowledgement and data refresh.
//
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
import type {
  VerificationRequirement,
} from '@/features/verification/models/verification-requirement';

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

  const requirements = useMemo<
    readonly VerificationRequirement[]
  >(
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

  const [
    selectedRequirement,
    setSelectedRequirement,
  ] = useState<VerificationRequirement | null>(null);

  // ---------------------------------------------------------------------------
  // Success acknowledgement state
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

  const handleStartVerification = useCallback(async () => {
    try {
      await startVerification();
      await reload();
    } catch {
      // useVerification owns and exposes the normalized error.
    }
  }, [reload, startVerification]);

  // ---------------------------------------------------------------------------
  // Loading
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
        {/* Requirements and inline submission                                */}
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
              selectedRequirement={selectedRequirement}
              onSelect={handleSelectRequirement}
              renderSubmission={(requirement) => (
                <VerificationSubmit
                  key={requirement.type}
                  requirement={requirement}
                  onSubmitted={handleSubmitted}
                />
              )}
            />
          </div>
        </div>

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
