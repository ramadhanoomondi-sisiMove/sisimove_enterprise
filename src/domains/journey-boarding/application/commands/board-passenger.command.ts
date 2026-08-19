// src/domains/journey-boarding/application/commands/board-passenger.command.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Board Passenger Command
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
 * Records the physical boarding of a passenger participating in a
 * Journey Boarding aggregate.
 *
 * The command explicitly identifies:
 *
 * - the Journey Boarding aggregate
 * - the passenger participant within that aggregate
 *
 * The aggregate owns all boarding invariants and event recording.
 */
export class BoardPassengerCommand extends Command {
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
     * Public identifier of the passenger participant being boarded.
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
    // Boarding Time
    // =========================================================================

    /**
     * Physical time at which the passenger boarded.
     *
     * When omitted, the aggregate operation uses the current time.
     */
    public readonly boardedAt?: Date,
  ) {
    super();
  }
}
