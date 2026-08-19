// src/domains/journey-boarding/application/command-handlers/open-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Open Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { OpenJourneyBoardingCommand } from '../commands/open-journey-boarding.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingPublicId } from '../../domain/value-objects/journey-boarding-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles opening the boarding process for a Journey Boarding aggregate.
 *
 * Workflow:
 *
 * 1. Convert the supplied public identifier into the domain value object.
 * 2. Load the Journey Boarding aggregate.
 * 3. Fail when the aggregate does not exist.
 * 4. Invoke the aggregate's open() operation.
 * 5. Persist the updated aggregate.
 * 6. Return the updated aggregate.
 *
 * The aggregate owns all lifecycle invariants and is responsible for
 * recording JourneyBoardingOpenedEvent.
 *
 * Valid lifecycle transition:
 *
 * NOT_STARTED → BOARDING
 */
export class OpenJourneyBoardingHandler implements CommandHandler<
  OpenJourneyBoardingCommand,
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
    command: OpenJourneyBoardingCommand,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Journey Boarding Public Identity
    // -------------------------------------------------------------------------

    const journeyBoardingPublicId = new JourneyBoardingPublicId(
      command.journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Existence
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new Error(
        `Journey boarding '${journeyBoardingPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Open Boarding
    // -------------------------------------------------------------------------

    /**
     * JourneyBoardingAggregate.open() is responsible for:
     *
     * - validating the current lifecycle state;
     * - rejecting invalid transitions;
     * - updating boardingStartedAt;
     * - incrementing the aggregate version;
     * - recording JourneyBoardingOpenedEvent.
     */
    aggregate.open(
      command.correlationId,
      command.causationId,
      command.boardingStartedAt,
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
