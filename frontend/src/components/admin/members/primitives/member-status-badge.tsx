
// -----------------------------------------------------------------------------
// sisiMove — Member Status Badge
// -----------------------------------------------------------------------------
//
// Member-specific status presentation for the Admin Members feature.
//
// Responsibilities:
// - Present identity lifecycle statuses consistently.
// - Map known statuses to the shared Badge semantic variants.
// - Display an understandable label for each status.
// - Remain independent of API calls and data fetching.
//
// Non-responsibilities:
// - Fetching or updating member status.
// - Performing status transitions.
// - Enforcing identity lifecycle rules.
// - Defining a separate visual badge system.
//
// Architecture:
//
// MemberStatusBadge
//        │
//        ▼
//   shared Badge
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
 * Identity lifecycle statuses supported by the sisiMove identity domain.
 */
export type MemberStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';

export interface MemberStatusBadgeProps {
  /**
   * Identity lifecycle status.
   */
  readonly status: MemberStatus;

  /**
   * Optional badge size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional additional presentation classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

const statusLabels: Record<MemberStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  CLOSED: 'Closed',
};

const statusVariants: Record<MemberStatus, BadgeVariant> = {
  PENDING: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'danger',
  CLOSED: 'outline',
};

// -----------------------------------------------------------------------------
// Member Status Badge
// -----------------------------------------------------------------------------

export function MemberStatusBadge({
  status,
  size = 'sm',
  className,
}: MemberStatusBadgeProps): ReactNode {
  return (
    <Badge
      variant={statusVariants[status]}
      size={size}
      className={className}
    >
      {statusLabels[status]}
    </Badge>
  );
}

export default MemberStatusBadge;
