// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmation Status
// -----------------------------------------------------------------------------
//
// Presentation component for an individual confirmation lifecycle status.
//
// Responsibilities:
// - render the confirmation status consistently;
// - translate the backend status into user-facing presentation;
// - use the shared sisiMove Badge primitive.
//
// Non-responsibilities:
// - changing confirmation state;
// - determining whether withdrawal is permitted;
// - making API requests;
// - interpreting authorization.
//
// The backend remains authoritative for confirmation lifecycle transitions.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { Badge } from '@/components/ui';

import {
  JourneyCompletionConfirmationStatus,
} from '@/features/journey-completion/models/journey-completion-confirmation-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyCompletionConfirmationStatusBadgeProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Badge>,
    'children' | 'variant'
  > {
  /**
   * Backend-provided confirmation lifecycle status.
   */
  status: JourneyCompletionConfirmationStatus;
}

// -----------------------------------------------------------------------------
// Presentation Helpers
// -----------------------------------------------------------------------------

function getStatusLabel(
  status: JourneyCompletionConfirmationStatus,
): string {
  switch (status) {
    case JourneyCompletionConfirmationStatus.CONFIRMED:
      return 'Confirmed';

    case JourneyCompletionConfirmationStatus.WITHDRAWN:
      return 'Withdrawn';
  }
}

function getStatusVariant(
  status: JourneyCompletionConfirmationStatus,
): ComponentPropsWithoutRef<typeof Badge>['variant'] {
  switch (status) {
    case JourneyCompletionConfirmationStatus.CONFIRMED:
      return 'success';

    case JourneyCompletionConfirmationStatus.WITHDRAWN:
      return 'warning';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render an individual Journey Completion confirmation status.
 */
export function JourneyCompletionConfirmationStatusBadge({
  status,
  ...badgeProps
}: JourneyCompletionConfirmationStatusBadgeProps) {
  const label = getStatusLabel(status);

  return (
    <Badge
      {...badgeProps}
      variant={getStatusVariant(status)}
      aria-label={`Confirmation status: ${label}`}
    >
      {label}
    </Badge>
  );
}