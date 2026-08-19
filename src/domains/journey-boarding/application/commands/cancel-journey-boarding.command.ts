// -----------------------------------------------------------------------------
// Journey Boarding — Cancel Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBoardingMemberPublicId,
  JourneyBoardingPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Cancels a Journey Boarding aggregate.
 *
 * Cancellation is permitted only while the Journey Boarding is cancellable.
 * A started Journey Boarding cannot be cancelled.
 *
 * The aggregate is responsible for enforcing lifecycle invariants and
 * recording JourneyBoardingCancelledEvent.
 */
export class CancelJourneyBoardingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Boarding aggregate.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,
    // -------------------------------------------------------------------------
    // Actor
    // -------------------------------------------------------------------------

    /**
     * Optional public identifier of the member performing the cancellation.
     *
     * This identifier is recorded as the actor on the domain event.
     */
    public readonly actorPublicId?: JourneyBoardingMemberPublicId,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Cancellation Timestamp
    // -------------------------------------------------------------------------

    /**
     * Optional timestamp at which the Journey Boarding was cancelled.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly cancelledAt?: Date,
  ) {
    super();
  }
}
