// -----------------------------------------------------------------------------
// sisiMove — Verification Summary
// -----------------------------------------------------------------------------
//
// Presentation-only summary of the traveller's verification state.
//
// Responsibilities:
// - Display the overall verification level/status.
// - Display member and driver verification cards.
// - Keep verification presentation grouped in one reusable component.
//
// Non-responsibilities:
// - Fetching verification data.
// - Determining verification state.
// - Submitting or cancelling verification requests.
// - Granting or rejecting verification.
//
// Architecture:
// - Consumes the Verification aggregate result and
//   VerificationRequirement presentation models.
// - Uses the shared Card primitive for the aggregate-level status surface.
// - Delegates requirement presentation to the member and driver cards.
// - Does not inspect VerificationRequest directly.
// - Does not derive verification from individual requirement statuses.
// - Verification.level is the authoritative source for the granted
//   verification level.
//
// Visual language:
// - Verification is presented as a compact trust/status surface.
// - SisiMove blue identifies granted verification.
// - Semantic colors are used only for meaningful verification states.
// - The summary remains compact, calm, and mobile-first.
// - Member and driver detail surfaces remain delegated to their own cards.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

import type {
  Verification,
  VerificationRequirement,
} from '@/features/verification/models';

import { DriverVerificationCard } from './driver-verification-card';
import { MemberVerificationCard } from './member-verification-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationSummaryProps {
  /**
   * Current aggregate verification state.
   *
   * Verification.level is authoritative for the granted verification level.
   */
  readonly verification: Verification;

  /**
   * Current verification requirement presentation models.
   *
   * Requirement rows are delegated to the member and driver cards.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Presentation-level action for managing member verification.
   */
  readonly onManageMember?: () => void;

  /**
   * Presentation-level action for managing driver verification.
   */
  readonly onManageDriver?: () => void;
}

// -----------------------------------------------------------------------------
// Verification Level Label
// -----------------------------------------------------------------------------

function getVerificationLabel(
  level: Verification['level'],
): string {
  switch (level) {
    case 'DRIVER':
      return 'Driver verified';

    case 'MEMBER':
      return 'Member verified';

    case 'NONE':
    default:
      return 'Not verified';
  }
}

// -----------------------------------------------------------------------------
// Verification Status Description
// -----------------------------------------------------------------------------

function getVerificationDescription(
  level: Verification['level'],
): string {
  switch (level) {
    case 'DRIVER':
      return 'Your identity is verified for member and driver participation.';

    case 'MEMBER':
      return 'Your identity is verified for member participation on sisiMove.';

    case 'NONE':
    default:
      return 'Complete verification to build trust and unlock verified participation.';
  }
}

// -----------------------------------------------------------------------------
// Verification Status Indicator
// -----------------------------------------------------------------------------
//
// This is intentionally presentation-only.
//
// The indicator does not determine verification. It receives the authoritative
// aggregate level and renders the corresponding visual state.
//

function VerificationStatusIndicator({
  level,
}: {
  readonly level: Verification['level'];
}): ReactNode {
  const verified =
    level === 'MEMBER' ||
    level === 'DRIVER';

  return (
    <span
      aria-hidden="true"
      className={[
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
        verified
          ? 'bg-[var(--brand-soft)]'
          : 'bg-[var(--background-muted)]',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-6 w-6 items-center justify-center rounded-full',
          verified
            ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
            : 'bg-[var(--border-strong)] text-[var(--surface)]',
        ].join(' ')}
      >
        {verified ? (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
          >
            <path
              d="m5 10 3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Verification Summary
// -----------------------------------------------------------------------------

export function VerificationSummary({
  verification,
  requirements,
  onManageMember,
  onManageDriver,
}: VerificationSummaryProps): ReactNode {
  // ---------------------------------------------------------------------------
  // Aggregate verification state
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  // These values are derived only from Verification.level.
  //
  // Individual requirement statuses must never be used to infer whether
  // verification has been granted. The Verification aggregate remains the
  // authoritative source.
  //
  // DRIVER verification implies MEMBER verification.
  //

  const memberVerified =
    verification.level === 'MEMBER' ||
    verification.level === 'DRIVER';

  const driverVerified =
    verification.level === 'DRIVER';

  const verified =
    verification.level === 'MEMBER' ||
    verification.level === 'DRIVER';

  return (
    <div className="space-y-4">

      {/* ---------------------------------------------------------------------
          Aggregate Verification Status
         --------------------------------------------------------------------- */}

      <Card
        variant="default"
        padding="md"
        className="
          overflow-hidden
          rounded-[var(--radius-2xl)]
          border-[var(--border)]
          bg-[var(--surface)]
          shadow-[var(--shadow-sm)]
        "
      >
        <div className="flex items-start gap-3.5 sm:gap-4">

          <VerificationStatusIndicator
            level={verification.level}
          />

          <div className="min-w-0 flex-1">

            {/* Status heading + compact state indicator */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                Verification status
              </p>

              {verified ? (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-[var(--success-border)]
                    bg-[var(--success-soft)]
                    px-2
                    py-0.5
                    text-[0.6875rem]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--success)]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-current"
                  />

                  Verified
                </span>
              ) : (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--background-subtle)]
                    px-2
                    py-0.5
                    text-[0.6875rem]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--foreground-muted)]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[var(--foreground-subtle)]"
                  />

                  Not verified
                </span>
              )}

            </div>

            <p className="mt-1.5 text-lg font-semibold tracking-[-0.015em] text-[var(--foreground)]">
              {getVerificationLabel(verification.level)}
            </p>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              {getVerificationDescription(verification.level)}
            </p>

            {/* ---------------------------------------------------------------
                Rejection / Review Note
               --------------------------------------------------------------- */}

            {verification.rejectionReason !== null ? (
              <div
                role="alert"
                className="
                  mt-4
                  rounded-[var(--radius-md)]
                  border
                  border-[var(--danger-border)]
                  bg-[var(--danger-soft)]
                  px-3.5
                  py-3
                "
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--danger)]">
                  Review note
                </p>

                <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                  {verification.rejectionReason}
                </p>
              </div>
            ) : null}

          </div>
        </div>
      </Card>

      {/* ---------------------------------------------------------------------
          Member Verification
         --------------------------------------------------------------------- */}

      <MemberVerificationCard
        requirements={requirements}
        verified={memberVerified}
        onManage={onManageMember}
      />

      {/* ---------------------------------------------------------------------
          Driver Verification
         --------------------------------------------------------------------- */}

      <DriverVerificationCard
        requirements={requirements}
        verified={driverVerified}
        onManage={onManageDriver}
      />

    </div>
  );
}