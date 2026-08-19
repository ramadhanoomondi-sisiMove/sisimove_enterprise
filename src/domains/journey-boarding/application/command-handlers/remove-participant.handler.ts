// -----------------------------------------------------------------------------
// Journey Boarding — Remove Participant Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveParticipantCommand } from '../commands/remove-participant.command';

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
 * Handles removal of a Journey Boarding participant.
 *
 * Workflow:
 *
 * 1. Locate the Journey Boarding aggregate by public identifier.
 * 2. Execute the aggregate participant-removal operation.
 * 3. Persist the updated aggregate.
 * 4. Return the updated aggregate.
 *
 * Participant lifecycle invariants remain inside the domain aggregate.
 */
export class RemoveParticipantHandler implements CommandHandler<
  RemoveParticipantCommand,
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
    command: RemoveParticipantCommand,
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
    // Remove Participant
    // -------------------------------------------------------------------------

    aggregate.removeParticipant(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.removedAt,
      command.actorPublicId,
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
