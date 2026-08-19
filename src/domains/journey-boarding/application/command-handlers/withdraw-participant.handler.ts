// -----------------------------------------------------------------------------
// Journey Boarding — Withdraw Participant Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { WithdrawParticipantCommand } from '../commands/withdraw-participant.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles withdrawal of a participant from a Journey Boarding.
 *
 * Workflow:
 *
 * 1. Locate the Journey Boarding aggregate by public identifier.
 * 2. Execute the aggregate withdrawal operation.
 * 3. Persist the updated aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate owns all participant lifecycle invariants and records the
 * corresponding domain event.
 */
export class WithdrawParticipantHandler implements CommandHandler<
  WithdrawParticipantCommand,
  JourneyBoardingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: WithdrawParticipantCommand,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new Error(
        `Journey Boarding '${command.journeyBoardingPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Withdraw Participant
    // -------------------------------------------------------------------------

    aggregate.withdrawParticipant(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.withdrawnAt,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
