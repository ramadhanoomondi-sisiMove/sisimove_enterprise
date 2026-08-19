// -----------------------------------------------------------------------------
// Journey Boarding — Remove Participant Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBoardingParticipantPublicId,
  JourneyBoardingPublicId,
  JourneyBoardingMemberPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Removes a participant from a Journey Boarding.
 *
 * A participant may be removed while EXPECTED or WITHDRAWN.
 *
 * The Journey Boarding aggregate is responsible for enforcing all participant
 * lifecycle invariants and recording JourneyBoardingParticipantRemovedEvent.
 */
export class RemoveParticipantCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Boarding aggregate.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,

    // -------------------------------------------------------------------------
    // Participant
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the participant being removed.
     */
    public readonly participantPublicId: JourneyBoardingParticipantPublicId,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Actor
    // -------------------------------------------------------------------------

    /**
     * Optional public identifier of the member performing the removal.
     *
     * This is recorded as the actor of the domain event and is not used as a
     * replacement for the aggregate's domain authorization rules.
     */
    public readonly actorPublicId?: JourneyBoardingMemberPublicId,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Removal Timestamp
    // -------------------------------------------------------------------------

    /**
     * Optional timestamp at which the participant was removed.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly removedAt?: Date,
  ) {
    super();
  }
}
