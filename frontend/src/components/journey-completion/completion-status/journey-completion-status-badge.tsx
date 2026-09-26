// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Status Badge
// -----------------------------------------------------------------------------
//
// Presentation component for displaying Journey Completion lifecycle status.
//
// Responsibilities:
// - render a consistent completion-status badge;
// - translate the domain status into user-facing presentation;
// - use the shared sisiMove Badge primitive.
//
// Non-responsibilities:
// - changing completion state;
// - determining whether an action is permitted;
// - making API requests;
// - fetching completion data;
// - interpreting authorization.
//
// The backend remains authoritative for Journey Completion lifecycle state.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { Badge } from '@/components/ui';

import {
  getJourneyCompletionStatusLabel,
} from '@/features/journey-completion/presentation';

import type { JourneyCompletionStatus } from '@/features/journey-completion/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Props for the Journey Completion status badge.
 *
 * Badge presentation props remain available through the shared UI primitive,
 * while children and variant are controlled by this component.
 */
export interface JourneyCompletionStatusBadgeProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Badge>,
    'children' | 'variant'
  > {
  /**
   * Current backend Journey Completion status.
   */
  status: JourneyCompletionStatus;
}

// -----------------------------------------------------------------------------
// Variant Mapping
// -----------------------------------------------------------------------------

/**
 * Maps Journey Completion lifecycle states to the semantic variants already
 * provided by the sisiMove Badge primitive.
 *
 * This function is presentation-only.
 *
 * It does not determine:
 * - whether a completion may transition;
 * - whether an action is available;
 * - whether a user is authorized;
 * - whether a completion is valid.
 */
function getJourneyCompletionBadgeVariant(
  status: JourneyCompletionStatus,
): ComponentPropsWithoutRef<typeof Badge>['variant'] {
  switch (status) {
    case 'CONFIRMED':
      return 'success';

    case 'DISPUTED':
      return 'warning';

    case 'CANCELLED':
      return 'danger';

    case 'CONFIRMATION_REQUIRED':
      return 'brand';

    case 'PENDING':
    default:
      return 'default';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render a Journey Completion lifecycle status.
 */
export function JourneyCompletionStatusBadge({
  status,
  ...badgeProps
}: JourneyCompletionStatusBadgeProps) {
  const label = getJourneyCompletionStatusLabel(status);

  return (
    <Badge
      {...badgeProps}
      variant={getJourneyCompletionBadgeVariant(status)}
      aria-label={`Journey completion status: ${label}`}
    >
      {label}
    </Badge>
  );
}