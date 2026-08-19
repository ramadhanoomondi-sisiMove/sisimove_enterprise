// -----------------------------------------------------------------------------
// Journey Boarding — Cancel Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelJourneyBoardingCommand } from '../commands/cancel-journey-boarding.command';

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
 * Handles cancellation of a Journey Boarding aggregate.
 *
 * Workflow:
 *
 * 1. Locate the Journey Boarding aggregate by public identifier.
 * 2. Execute the aggregate cancellation operation.
 * 3. Persist the updated aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate remains responsible for determining whether cancellation
 * is currently permitted.
 */
export class CancelJourneyBoardingHandler implements CommandHandler<
  CancelJourneyBoardingCommand,
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
    command: CancelJourneyBoardingCommand,
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
    // Cancel Boarding
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt,
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
