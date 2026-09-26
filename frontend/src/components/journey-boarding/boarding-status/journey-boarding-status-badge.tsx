// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Status Badge
// -----------------------------------------------------------------------------
//
// Domain-specific status presentation for Journey Boarding.
//
// Responsibilities:
// - Render a Journey Boarding lifecycle status using the shared Badge
//   presentation primitive.
// - Map domain statuses to semantic visual variants.
// - Provide human-readable status labels.
//
// Architectural rules:
// - No lifecycle/business rules are implemented here.
// - The backend remains authoritative for the actual Journey Boarding status.
// - This component only translates an existing domain status into UI.
// - The shared Badge component owns the underlying visual primitive.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Badge, type BadgeVariant } from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Domain Model
// -----------------------------------------------------------------------------

import { JourneyBoardingStatus } from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingStatusBadgeProps {
  /**
   * Current Journey Boarding lifecycle status.
   */
  status: JourneyBoardingStatus;

  /**
   * Badge size.
   *
   * Defaults to the standard medium badge used by the boarding UI.
   */
  size?: 'sm' | 'md';
}

// -----------------------------------------------------------------------------
// Presentation Configuration
// -----------------------------------------------------------------------------

interface StatusPresentation {
  label: string;
  variant: BadgeVariant;
}

const statusPresentation: Record<
  JourneyBoardingStatus,
  StatusPresentation
> = {
  [JourneyBoardingStatus.NOT_STARTED]: {
    label: 'Not started',
    variant: 'default',
  },

  [JourneyBoardingStatus.BOARDING]: {
    label: 'Boarding',
    variant: 'brand',
  },

  [JourneyBoardingStatus.STARTED]: {
    label: 'Started',
    variant: 'success',
  },

  [JourneyBoardingStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'danger',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingStatusBadge({
  status,
  size = 'md',
}: JourneyBoardingStatusBadgeProps) {
  const presentation = statusPresentation[status];

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      aria-label={`Boarding status: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}