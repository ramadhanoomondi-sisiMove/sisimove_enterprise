// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Row
// -----------------------------------------------------------------------------
//
// Presentation-only row for one verification requirement.
//
// Responsibilities:
// - Display the requirement name.
// - Display its current status.
// - Optionally display the rejection reason.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting or cancelling requests.
// - Determining requirement status.
// - Performing verification.
// - Accessing VerificationRequest directly.
//
// Architecture:
// - Consumes the VerificationRequirement application/presentation model.
// - The requirement type identifies the requirement within this
//   presentation model.
// - requestPublicId and assetPublicId remain opaque and are not used to
//   construct links or asset URLs here.
// - Status presentation is delegated to VerificationRequirementStatus.
//
// Visual language:
// - Compact and highly scannable.
// - Uses sisiMove foreground and border tokens.
// - Status remains the primary state indicator.
// - Requirement identity is visually stronger than its description.
// - Mobile layouts allow the status to move below the requirement content.
// - Rejection details use the semantic danger palette without overpowering
//   the requirement itself.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  VerificationRequirement,
} from '@/features/verification/models';

import { VerificationRequirementStatus } from './verification-requirement-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRequirementRowProps {
  /**
   * Current state of one verification requirement.
   */
  readonly requirement: VerificationRequirement;
}

// -----------------------------------------------------------------------------
// Requirement Label
// -----------------------------------------------------------------------------

function getRequirementLabel(
  type: VerificationRequirement['type'],
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'Profile photo';

    case 'GOVERNMENT_ID':
      return 'Government ID';

    case 'DRIVER_LICENSE':
      return 'Driver license';

    default:
      return 'Verification requirement';
  }
}

// -----------------------------------------------------------------------------
// Requirement Description
// -----------------------------------------------------------------------------

function getRequirementDescription(
  type: VerificationRequirement['type'],
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'A clear photo of you';

    case 'GOVERNMENT_ID':
      return 'Government-issued identification';

    case 'DRIVER_LICENSE':
      return 'Valid driver licensing';

    default:
      return 'Verification information';
  }
}

// -----------------------------------------------------------------------------
// Verification Requirement Row
// -----------------------------------------------------------------------------

export function VerificationRequirementRow({
  requirement,
}: VerificationRequirementRowProps): ReactNode {
  const label = getRequirementLabel(requirement.type);

  const description = getRequirementDescription(
    requirement.type,
  );

  const hasRejection =
    requirement.rejectionReason !== null &&
    requirement.rejectionReason.trim().length > 0;

  return (
    <div
      className="
        border-b
        border-[var(--border-subtle)]
        py-4
        last:border-b-0
      "
    >
      {/* ---------------------------------------------------------------------
          Requirement + Status
         --------------------------------------------------------------------- */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
          sm:gap-4
        "
      >
        {/* -------------------------------------------------------------------
            Requirement Information
           ------------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">

          <div className="flex min-w-0 items-center gap-2">

            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-[var(--border-strong)]
              "
            />

            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {label}
            </p>

          </div>

          <p
            className="
              mt-1
              pl-3.5
              text-xs
              leading-5
              text-[var(--foreground-muted)]
            "
          >
            {description}
          </p>

        </div>

        {/* -------------------------------------------------------------------
            Requirement Status
           ------------------------------------------------------------------- */}

        <div className="shrink-0 sm:pt-0.5">
          <VerificationRequirementStatus
            status={requirement.status}
          />
        </div>

      </div>

      {/* ---------------------------------------------------------------------
          Rejection Reason
         --------------------------------------------------------------------- */}

      {hasRejection ? (
        <div
          className="
            ml-3.5
            mt-3
            rounded-[var(--radius-md)]
            border
            border-[var(--danger-border)]
            bg-[var(--danger-soft)]
            px-3
            py-2.5
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[var(--danger)]
            "
          >
            Review note
          </p>

          <p
            className="
              mt-0.5
              text-xs
              leading-5
              text-[var(--foreground-secondary)]
            "
          >
            {requirement.rejectionReason}
          </p>
        </div>
      ) : null}
    </div>
  );
}