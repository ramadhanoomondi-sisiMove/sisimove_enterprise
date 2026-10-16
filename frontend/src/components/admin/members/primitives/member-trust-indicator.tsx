
// -----------------------------------------------------------------------------
// sisiMove — Member Trust Indicator
// -----------------------------------------------------------------------------
//
// Member-specific trust presentation for the Admin Members feature.
//
// Responsibilities:
// - Present the member's trust-profile status.
// - Display the trust verification level when supplied.
// - Reuse the shared Badge primitive.
// - Keep trust presentation independent of API calls.
//
// Non-responsibilities:
// - Fetching trust profiles or trust events.
// - Calculating trust scores or ratings.
// - Inferring trust from identity lifecycle status.
// - Changing trust-profile state.
//
// Architecture:
//
// MemberTrustIndicator
//         │
//         ▼
//    shared Badge
//
// Trust-profile status and verification level are separate concepts.
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
 * Trust-profile status.
 *
 * Values must match the backend TrustProfileStatus enum before API integration.
 */
export type MemberTrustStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RESTRICTED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MemberTrustIndicatorProps {
  /**
   * Trust-profile status.
   */
  readonly status: MemberTrustStatus;

  /**
   * Trust verification level, when available.
   *
   * Pass the value defined by the backend contract.
   */
  readonly verificationLevel?: string | null;

  /**
   * Optional badge size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional presentation classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

const trustStatusLabels: Record<MemberTrustStatus, string> = {
  ACTIVE: 'Trust active',
  SUSPENDED: 'Trust suspended',
  RESTRICTED: 'Trust restricted',
};

const trustStatusVariants: Record<
  MemberTrustStatus,
  BadgeVariant
> = {
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  RESTRICTED: 'danger',
};

// -----------------------------------------------------------------------------
// Member Trust Indicator
// -----------------------------------------------------------------------------

export function MemberTrustIndicator({
  status,
  verificationLevel,
  size = 'sm',
  className,
}: MemberTrustIndicatorProps): ReactNode {
  const resolvedLevel = verificationLevel?.trim();

  return (
    <div
      className="flex min-w-0 flex-wrap items-center gap-2"
      aria-label="Member trust information"
    >
      <Badge
        variant={trustStatusVariants[status]}
        size={size}
        className={className}
      >
        {trustStatusLabels[status]}
      </Badge>

      {resolvedLevel ? (
        <Badge variant="outline" size={size}>
          {resolvedLevel.replace(/_/g, ' ')}
        </Badge>
      ) : null}
    </div>
  );
}

export default MemberTrustIndicator;
