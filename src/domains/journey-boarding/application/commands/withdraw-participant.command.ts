// -----------------------------------------------------------------------------
// Journey Boarding — Withdraw Participant Command
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
 * Withdraws a participant from a Journey Boarding.
 *
 * The Journey Boarding public identifier establishes the aggregate boundary,
 * while the participant public identifier identifies the participant within
 * that aggregate.
 */
export class WithdrawParticipantCommand extends Command {
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
     * Public identifier of the participant being withdrawn.
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
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Identifier of the command or event that caused this command, when
     * applicable.
     */
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Withdrawal Timestamp
    // -------------------------------------------------------------------------

    /**
     * Optional timestamp at which the participant withdrew.
     */
    public readonly withdrawnAt?: Date,
  ) {
    super();
  }
}
