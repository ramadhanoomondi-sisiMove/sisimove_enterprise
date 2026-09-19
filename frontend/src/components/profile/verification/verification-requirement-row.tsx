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
// - The requirement type is the identity of the requirement within this
//   presentation model.
// - requestPublicId and assetPublicId remain opaque and are not used to
//   construct links or asset URLs here.
// - Status presentation is delegated to VerificationRequirementStatus.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { VerificationRequirement } from '@/features/verification/models';

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
// Verification Requirement Row
// -----------------------------------------------------------------------------

export function VerificationRequirementRow({
  requirement,
}: VerificationRequirementRowProps): ReactNode {
  const label = getRequirementLabel(requirement.type);

  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">
          {label}
        </div>

        {requirement.rejectionReason !== null ? (
          <div className="mt-1 text-xs text-muted-foreground">
            {requirement.rejectionReason}
          </div>
        ) : null}
      </div>

      <div className="shrink-0">
        <VerificationRequirementStatus status={requirement.status} />
      </div>
    </div>
  );
}