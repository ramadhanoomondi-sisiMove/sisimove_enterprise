// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Status Badge
// -----------------------------------------------------------------------------
//
// Presentation of an individual Journey Boarding participant status.
//
// Responsibilities:
// - Translate participant status into a semantic Badge.
// - Provide human-readable participant status text.
//
// Architectural rules:
// - No participant lifecycle rules are implemented here.
// - The backend remains authoritative for participant state.
// - This component only presents the supplied domain status.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Badge, type BadgeVariant } from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Domain Model
// -----------------------------------------------------------------------------

import { JourneyBoardingParticipantStatus } from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantStatusBadgeProps {
  /**
   * Current participant boarding status.
   */
  status: JourneyBoardingParticipantStatus;

  /**
   * Badge size.
   */
  size?: 'sm' | 'md';
}

// -----------------------------------------------------------------------------
// Presentation Configuration
// -----------------------------------------------------------------------------

interface ParticipantStatusPresentation {
  label: string;
  variant: BadgeVariant;
}

const statusPresentation: Record<
  JourneyBoardingParticipantStatus,
  ParticipantStatusPresentation
> = {
  [JourneyBoardingParticipantStatus.EXPECTED]: {
    label: 'Expected',
    variant: 'default',
  },

  [JourneyBoardingParticipantStatus.BOARDED]: {
    label: 'Boarded',
    variant: 'success',
  },

  [JourneyBoardingParticipantStatus.WITHDRAWN]: {
    label: 'Withdrawn',
    variant: 'warning',
  },

  [JourneyBoardingParticipantStatus.NO_SHOW]: {
    label: 'No show',
    variant: 'danger',
  },

  [JourneyBoardingParticipantStatus.REMOVED]: {
    label: 'Removed',
    variant: 'danger',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingParticipantStatusBadge({
  status,
  size = 'sm',
}: JourneyBoardingParticipantStatusBadgeProps) {
  const presentation = statusPresentation[status];

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      aria-label={`Participant status: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}