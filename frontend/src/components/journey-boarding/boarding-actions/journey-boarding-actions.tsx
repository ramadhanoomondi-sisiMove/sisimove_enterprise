// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Actions
// -----------------------------------------------------------------------------
//
// Coordinates the complete action surface for Journey Boarding.
//
// Responsibilities:
// - Compose lifecycle actions.
// - Compose provider boarding actions.
// - Compose passenger participant actions.
// - Compose the authenticated passenger's own participant action.
// - Pass the current boarding projection to the appropriate action components.
// - Keep action composition separate from mutation implementation.
//
// Non-responsibilities:
// - Does not perform API requests.
// - Does not own React Query mutations.
// - Does not reproduce aggregate business rules.
// - Does not determine whether an operation is ultimately authorized.
// - Does not mutate the Journey Boarding model.
// - Does not invent lifecycle transitions.
//
// The backend JourneyBoardingAggregate remains authoritative for all lifecycle
// and participant transitions. Individual action components are responsible for
// presenting their own applicable/hidden state according to the supplied
// aggregate projection and their mutation state.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

import { OpenJourneyBoardingAction } from './open-journey-boarding-action';
import { BoardProviderAction } from './board-provider-action';
import { BoardPassengerAction } from './board-passenger-action';
import { MarkPassengerNoShowAction } from './mark-passenger-no-show-action';
import { WithdrawParticipantAction } from './withdraw-participant-action';
import { RemoveParticipantAction } from './remove-participant-action';
import { StartJourneyAction } from './start-journey-action';
import { CancelJourneyBoardingAction } from './cancel-journey-boarding-action';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingActionsProps {
  /**
   * Current Journey Boarding projection.
   *
   * The projection is passed unchanged to action components. No local copy or
   * derived domain state is maintained here.
   */
  boarding: JourneyBoarding;

  /**
   * Whether the authenticated member is the Journey provider.
   *
   * This context comes from the authenticated application boundary. The
   * component deliberately does not infer the member's role from arbitrary
   * public identifiers.
   */
  isProvider: boolean;

  /**
   * Public ID of the authenticated member.
   *
   * Required when rendering passenger-specific actions so the component can
   * resolve the authenticated member's own boarding participant.
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
  // ---------------------------------------------------------------------------
  // Participant projections
  // ---------------------------------------------------------------------------
  //
  // These are presentation-level selections from the supplied aggregate
  // projection. They do not represent domain decisions.
  // ---------------------------------------------------------------------------

  const providerParticipant = boarding.participants.find(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PROVIDER,
  );

  const passengerParticipants = boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER,
  );

  const currentPassengerParticipant =
    currentMemberPublicId === undefined
      ? undefined
      : passengerParticipants.find(
          (participant) =>
            participant.memberPublicId === currentMemberPublicId,
        );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
            Available actions for this boarding.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* ----------------------------------------------------------------- */}
        {/* Boarding lifecycle                                                 */}
        {/* ----------------------------------------------------------------- */}

        {isProvider && (
          <OpenJourneyBoardingAction boarding={boarding} />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Provider boarding                                                  */}
        {/* ----------------------------------------------------------------- */}

        {isProvider && providerParticipant && (
          <BoardProviderAction
            boarding={boarding}
            participant={providerParticipant}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Passenger participant operations                                   */}
        {/* ----------------------------------------------------------------- */}
        {isProvider &&
          passengerParticipants.map((participant) => (
            <div
              key={participant.publicId}
              className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-3 first:border-t-0 first:pt-0"
            >
              <div className="text-sm font-medium text-[var(--foreground)]">
                Passenger
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <BoardPassengerAction
                  boarding={boarding}
                  participant={participant}
                />

                <MarkPassengerNoShowAction
                  boarding={boarding}
                  participant={participant}
                />

                <RemoveParticipantAction
                  boarding={boarding}
                  participant={participant}
                />
              </div>
            </div>
          ))}

        {/* ----------------------------------------------------------------- */}
        {/* Current passenger operation                                        */}
        {/* ----------------------------------------------------------------- */}
        {!isProvider && currentPassengerParticipant && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <WithdrawParticipantAction
              boarding={boarding}
              participant={currentPassengerParticipant}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Journey lifecycle                                                  */}
        {/* ----------------------------------------------------------------- */}

        {isProvider && (
          <>
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <StartJourneyAction boarding={boarding} />
            </div>

            <CancelJourneyBoardingAction boarding={boarding} />
          </>
        )}
      </div>
    </Card>
  );
}