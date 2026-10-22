
/**
 * sisiMove — Trust Status Badge
 *
 * Presents Trust-domain statuses using the shared sisiMove Badge component.
 *
 * Responsibilities:
 * - Map known Trust statuses to semantic visual variants.
 * - Keep Trust status presentation consistent across admin screens.
 * - Support unknown statuses safely without inventing their meaning.
 *
 * Non-responsibilities:
 * - Enforcing permissions or business rules.
 * - Changing Trust lifecycle state.
 * - Fetching or transforming API data.
 */

import type { ReactNode } from 'react';

import {
  Badge,
  type BadgeVariant,
} from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustStatusBadgeStatus =
  | 'active'
  | 'inactive'
  | 'verified'
  | 'unverified'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'hidden'
  | 'removed'
  | 'revoked'
  | 'completed'
  | 'cancelled'
  | 'unknown';

export interface TrustStatusBadgeProps {
  /**
   * Status to present.
   *
   * Unknown or unrecognized API values fall back to neutral presentation.
   */
  status: string | null | undefined;

  /**
   * Optional human-readable label override.
   */
  label?: string;

  /**
   * Optional content rendered before the label.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content rendered after the label.
   */
  trailingContent?: ReactNode;

  /**
   * Shared badge size.
   */
  size?: 'sm' | 'md';

  /**
   * Additional styling for specific layouts.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Status configuration
// -----------------------------------------------------------------------------

interface TrustStatusConfiguration {
  label: string;
  variant: BadgeVariant;
}

const STATUS_CONFIG: Record<
  TrustStatusBadgeStatus,
  TrustStatusConfiguration
> = {
  active: {
    label: 'Active',
    variant: 'success',
  },

  inactive: {
    label: 'Inactive',
    variant: 'default',
  },

  verified: {
    label: 'Verified',
    variant: 'success',
  },

  unverified: {
    label: 'Unverified',
    variant: 'warning',
  },

  pending: {
    label: 'Pending',
    variant: 'warning',
  },

  approved: {
    label: 'Approved',
    variant: 'success',
  },

  rejected: {
    label: 'Rejected',
    variant: 'danger',
  },

  hidden: {
    label: 'Hidden',
    variant: 'warning',
  },

  removed: {
    label: 'Removed',
    variant: 'danger',
  },

  revoked: {
    label: 'Revoked',
    variant: 'danger',
  },

  completed: {
    label: 'Completed',
    variant: 'success',
  },

  cancelled: {
    label: 'Cancelled',
    variant: 'default',
  },

  unknown: {
    label: 'Unknown',
    variant: 'outline',
  },
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeStatus(
  status: string | null | undefined,
): string {
  return status?.trim().toLowerCase() ?? '';
}

function formatUnknownStatus(status: string): string {
  return status
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustStatusBadge({
  status,
  label,
  leadingContent,
  trailingContent,
  size = 'sm',
  className,
}: TrustStatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);

  const knownStatus =
    Object.prototype.hasOwnProperty.call(
      STATUS_CONFIG,
      normalizedStatus,
    )
      ? (normalizedStatus as TrustStatusBadgeStatus)
      : 'unknown';

  const configuration = STATUS_CONFIG[knownStatus];

  const displayLabel =
    label ??
    (knownStatus === 'unknown' && normalizedStatus
      ? formatUnknownStatus(normalizedStatus)
      : configuration.label);

  return (
    <Badge
      variant={configuration.variant}
      size={size}
      leadingContent={leadingContent}
      trailingContent={trailingContent}
      className={className}
    >
      {displayLabel}
    </Badge>
  );
}
