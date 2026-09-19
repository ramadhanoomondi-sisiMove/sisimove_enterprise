// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Status
// -----------------------------------------------------------------------------
//
// Presentation-only status indicator for one verification requirement.
//
// Responsibilities:
// - Display the current verification requirement status.
// - Provide consistent visual treatment for each known status.
//
// Non-responsibilities:
// - Determining verification status.
// - Submitting verification requests.
// - Fetching verification data.
// - Performing verification actions.
//
// Architecture:
// - Consumes the VerificationRequirementStatus presentation model.
// - Maps domain/application status values to human-readable UI labels.
// - Contains no API, hook, mutation, or verification workflow logic.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { VerificationRequirementStatus } from '@/features/verification/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRequirementStatusProps {
  /**
   * Current status of the verification requirement.
   */
  readonly status: VerificationRequirementStatus;
}

// -----------------------------------------------------------------------------
// Status Label
// -----------------------------------------------------------------------------

function getStatusLabel(
  status: VerificationRequirementStatus,
): string {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not started';

    case 'PENDING':
      return 'Pending review';

    case 'APPROVED':
      return 'Verified';

    case 'REJECTED':
      return 'Rejected';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return 'Unknown';
  }
}

// -----------------------------------------------------------------------------
// Verification Requirement Status
// -----------------------------------------------------------------------------

export function VerificationRequirementStatus({
  status,
}: VerificationRequirementStatusProps): ReactNode {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {getStatusLabel(status)}
    </span>
  );
}