// -----------------------------------------------------------------------------
// Journey Boarding — Start Journey Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Starts the Journey associated with a Journey Boarding aggregate.
 *
 * The provider must already be physically boarded.
 *
 * The aggregate is responsible for enforcing the Journey Boarding lifecycle
 * invariants and recording JourneyBoardingStartedEvent.
 */
export class StartJourneyCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Boarding aggregate.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Journey Start Timestamp
    // -------------------------------------------------------------------------

    /**
     * Optional timestamp at which the Journey started.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly journeyStartedAt?: Date,
  ) {
    super();
  }
}
