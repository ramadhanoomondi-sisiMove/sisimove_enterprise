// src/domains/journey-boarding/application/commands/mark-passenger-no-show.command.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Mark Passenger No-Show Command
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
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Records that a passenger expected to board a Journey Boarding did not show.
 *
 * The command explicitly identifies:
 *
 * - the Journey Boarding aggregate
 * - the passenger participant within that aggregate
 *
 * The aggregate owns all no-show invariants and records the resulting
 * JourneyBoardingPassengerNoShowEvent.
 */
export class MarkPassengerNoShowCommand extends Command {
  constructor(
    // =========================================================================
    // Journey Boarding
    // =========================================================================

    /**
     * Public identifier of the Journey Boarding aggregate.
     */
    public readonly journeyBoardingPublicId: JourneyBoardingPublicId,

    // =========================================================================
    // Participant
    // =========================================================================

    /**
     * Public identifier of the passenger participant being marked as
     * a no-show.
     */
    public readonly participantPublicId: JourneyBoardingParticipantPublicId,

    // =========================================================================
    // Correlation
    // =========================================================================

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // =========================================================================
    // Causation
    // =========================================================================

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // =========================================================================
    // No-Show Time
    // =========================================================================

    /**
     * Time at which the passenger was determined to be a no-show.
     *
     * When omitted, the aggregate operation uses the current time.
     */
    public readonly noShowAt?: Date,
  ) {
    super();
  }
}
