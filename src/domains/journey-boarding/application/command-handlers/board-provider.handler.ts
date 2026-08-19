// src/domains/journey-boarding/application/command-handlers/board-provider.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Board Provider Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { BoardProviderCommand } from '../commands/board-provider.command';

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
 * Handles boarding of the provider participating in a Journey Boarding
 * process.
 *
 * Workflow:
 *
 * 1. Convert the supplied public identifier into the domain value object.
 * 2. Load the Journey Boarding aggregate.
 * 3. Fail when the aggregate does not exist.
 * 4. Invoke the aggregate's boardProvider() operation.
 * 5. Persist the updated aggregate.
 * 6. Return the updated aggregate.
 *
 * The aggregate owns all provider-boarding invariants and is responsible for
 * recording JourneyBoardingProviderBoardedEvent.
 *
 * Participant lifecycle transition:
 *
 * EXPECTED → BOARDED
 */
export class BoardProviderHandler implements CommandHandler<
  BoardProviderCommand,
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
    command: BoardProviderCommand,
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
    // Board Provider
    // -------------------------------------------------------------------------

    /**
     * JourneyBoardingAggregate.boardProvider() is responsible for:
     *
     * - validating that participant modification is allowed;
     * - validating that the boarding lifecycle is BOARDING;
     * - resolving the provider participant;
     * - validating the provider participant identity;
     * - validating the participant status;
     * - transitioning EXPECTED → BOARDED;
     * - touching the aggregate timestamp;
     * - incrementing the aggregate version;
     * - recording JourneyBoardingProviderBoardedEvent.
     */
    aggregate.boardProvider(
      command.correlationId,
      command.causationId,
      command.boardedAt,
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
