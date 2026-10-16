
// -----------------------------------------------------------------------------
// sisiMove — Member Verification Badge
// -----------------------------------------------------------------------------
//
// Member-specific verification presentation for the Admin Members feature.
//
// Responsibilities:
// - Present verification status consistently.
// - Map known verification statuses to shared Badge variants.
// - Display readable labels for verification states.
// - Remain independent of API calls and data fetching.
//
// Non-responsibilities:
// - Fetching or reviewing verification records.
// - Approving or rejecting verification requests.
// - Determining verification eligibility.
// - Inferring verification status from individual document flags.
//
// Architecture:
//
// MemberVerificationBadge
//          │
//          ▼
//     shared Badge
//
// Verification status remains distinct from identity lifecycle status.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  Badge,
  type BadgeVariant,
} from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Verification lifecycle states.
 *
 * These values should match the VerificationStatus enum returned by
 * the backend API. Confirm that enum before wiring this component to API data.
 */
export type MemberVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NOT_SUBMITTED';

export interface MemberVerificationBadgeProps {
  /**
   * Verification status supplied by the caller.
   */
  readonly status: MemberVerificationStatus;

  /**
   * Optional badge size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional presentation classes supplied by the parent.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

const verificationLabels: Record<
  MemberVerificationStatus,
  string
> = {
  PENDING: 'Pending verification',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  NOT_SUBMITTED: 'Not submitted',
};

const verificationVariants: Record<
  MemberVerificationStatus,
  BadgeVariant
> = {
  PENDING: 'warning',
  VERIFIED: 'success',
  REJECTED: 'danger',
  EXPIRED: 'danger',
  NOT_SUBMITTED: 'outline',
};

// -----------------------------------------------------------------------------
// Member Verification Badge
// -----------------------------------------------------------------------------

export function MemberVerificationBadge({
  status,
  size = 'sm',
  className,
}: MemberVerificationBadgeProps): ReactNode {
  return (
    <Badge
      variant={verificationVariants[status]}
      size={size}
      className={className}
    >
      {verificationLabels[status]}
    </Badge>
  );
}

export default MemberVerificationBadge;
