// -----------------------------------------------------------------------------
// Journey Boarding — Start Journey Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { StartJourneyCommand } from '../commands/start-journey.command';

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
 * Handles starting the Journey associated with a Journey Boarding.
 *
 * Workflow:
 *
 * 1. Locate the Journey Boarding aggregate.
 * 2. Execute the domain startJourney operation.
 * 3. Persist the updated aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate enforces that:
 *
 * - boarding is currently open;
 * - the Journey Boarding has not been cancelled;
 * - the Journey has not already started;
 * - the provider has physically boarded.
 */
export class StartJourneyHandler implements CommandHandler<
  StartJourneyCommand,
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
    command: StartJourneyCommand,
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
    // Start Journey
    // -------------------------------------------------------------------------

    aggregate.startJourney(
      command.correlationId,
      command.causationId,
      command.journeyStartedAt,
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
