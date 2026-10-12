
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Actions
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render the authenticated passenger's own withdrawal action.
// - Resolve the passenger's participant from the current boarding projection.
//
// Non-responsibilities:
// - Does not render provider passenger-management actions.
// - Does not render provider journey-lifecycle actions.
// - Does not perform API requests or own mutations.
// - Does not determine backend authorization.
//
// The backend JourneyBoardingAggregate remains authoritative.
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  type JourneyBoarding,
} from "@/features/journey-boarding/models";

import { Card } from "@/components/ui";

import { WithdrawParticipantAction } from "./withdraw-participant-action";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingActionsProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Whether the authenticated member is the Journey provider.
   */
  isProvider: boolean;

  /**
   * Public ID of the authenticated member.
   */
  currentMemberPublicId?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingActions({
  boarding,
  isProvider,
  currentMemberPublicId,
}: JourneyBoardingActionsProps) {
  // Providers do not receive passenger withdrawal actions.
  if (isProvider) {
    return null;
  }

  // Without the authenticated member ID, we cannot safely resolve
  // which participant belongs to the current passenger.
  if (!currentMemberPublicId) {
    return null;
  }

  const currentPassengerParticipant = boarding.participants.find(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER &&
      participant.memberPublicId === currentMemberPublicId,
  );

  // No matching participant means there is no withdrawal action to render.
  if (!currentPassengerParticipant) {
    return null;
  }

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Boarding actions
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Manage your own passenger participation.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <WithdrawParticipantAction
          boarding={boarding}
          participant={currentPassengerParticipant}
        />
      </div>
    </Card>
  );
}
