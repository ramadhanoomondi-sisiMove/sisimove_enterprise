// -----------------------------------------------------------------------------
// sisiMove — Verification Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for managing traveller verification.
//
// Responsibilities:
// - Present the traveller's verification summary.
// - Provide the primary section-level Manage action.
// - Delegate detailed presentation to VerificationSummary.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling verification requests.
// - Reviewing verification requests.
// - Granting or rejecting verification.
//
// Those concerns belong to the verification feature's API/application layer.
//
// Architecture:
// - Presentation-only profile section.
// - Receives Verification and VerificationRequirement data from its parent.
// - Uses the shared Button primitive for section-level interaction.
// - Delegates verification-state presentation to VerificationSummary.
// - Does not access verification hooks or APIs.
// - Does not determine verification eligibility.
//
// Visual language:
// - Compact authenticated-profile section.
// - SisiMove blue identifies the section.
// - Section-level action remains lightweight and secondary.
// - Detailed verification actions remain delegated to VerificationSummary.
// - No additional card wrapper is introduced here; child surfaces own their
//   presentation treatment.
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import type {
  Verification,
  VerificationRequirement,
} from '@/features/verification/models';

import { VerificationSummary } from './verification-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationSectionProps {
  /**
   * Current aggregate verification state.
   *
   * The Verification aggregate remains authoritative for granted
   * verification level.
   */
  readonly verification: Verification;

  /**
   * Current verification requirement presentation models.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Primary section-level action for opening verification management.
   */
  readonly onManage?: () => void;

  /**
   * Action for opening member verification management.
   */
  readonly onManageMember?: () => void;

  /**
   * Action for opening driver verification management.
   */
  readonly onManageDriver?: () => void;
}

// -----------------------------------------------------------------------------
// Verification Section
// -----------------------------------------------------------------------------

export function VerificationSection({
  verification,
  requirements,
  onManage,
  onManageMember,
  onManageDriver,
}: VerificationSectionProps): ReactNode {
  return (
    <section className="space-y-5">
      {/* ---------------------------------------------------------------------
          Section Header
         --------------------------------------------------------------------- */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span
              aria-hidden="true"
              className="
                size-2
                shrink-0
                rounded-full
                bg-[var(--brand)]
              "
            />

            <h2
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--foreground)]
              "
            >
              Verification
            </h2>

          </div>

          <p
            className="
              mt-1.5
              max-w-2xl
              text-sm
              leading-5
              text-[var(--foreground-secondary)]
            "
          >
            Verify your identity and driving credentials for protected
            sisiMove actions.
          </p>

        </div>

        {/* -------------------------------------------------------------------
            Section-Level Action
           ------------------------------------------------------------------- */}

        {onManage !== undefined ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onManage}
            className="
              self-start
              shrink-0
              text-[var(--brand)]
              hover:bg-[var(--brand-soft)]
              hover:text-[var(--brand-hover)]
              focus-visible:ring-[var(--brand)]
            "
          >
            Manage verification
          </Button>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------------
          Verification Summary
         --------------------------------------------------------------------- */}

      <VerificationSummary
        verification={verification}
        requirements={requirements}
        onManageMember={onManageMember}
        onManageDriver={onManageDriver}
      />
    </section>
  );
}