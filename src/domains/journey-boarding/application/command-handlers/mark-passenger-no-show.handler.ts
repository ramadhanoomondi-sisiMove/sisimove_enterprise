// src/domains/journey-boarding/application/command-handlers/mark-passenger-no-show.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Mark Passenger No-Show Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { MarkPassengerNoShowCommand } from '../commands/mark-passenger-no-show.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles marking a passenger as a no-show.
 *
 * Workflow:
 *
 * 1. Resolve the Journey Boarding aggregate by public ID.
 * 2. Fail when the aggregate does not exist.
 * 3. Delegate the no-show operation to the aggregate.
 * 4. Persist the mutated aggregate.
 * 5. Return the updated aggregate.
 *
 * All lifecycle and participant invariants remain inside the aggregate.
 */
export class MarkPassengerNoShowHandler implements CommandHandler<
  MarkPassengerNoShowCommand,
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
    command: MarkPassengerNoShowCommand,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Aggregate Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBoardingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(
        command.journeyBoardingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Domain Operation
    // -------------------------------------------------------------------------

    aggregate.markPassengerNoShow(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.noShowAt,
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
