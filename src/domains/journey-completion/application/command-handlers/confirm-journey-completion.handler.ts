// -----------------------------------------------------------------------------
// Journey Completion — Confirm Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ConfirmJourneyCompletionCommand } from '../commands/confirm-journey-completion.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyCompletionNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles confirmation of a Journey Completion.
 *
 * The handler is responsible only for application-level orchestration:
 *
 * 1. Locate the Journey Completion aggregate.
 * 2. Fail explicitly when the aggregate does not exist.
 * 3. Delegate confirmation to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the updated aggregate.
 *
 * JourneyCompletionAggregate.confirm() owns:
 *
 * - lifecycle validation;
 * - confirmation-threshold validation;
 * - confirmation state transition;
 * - confirmedAt;
 * - aggregate versioning;
 * - JourneyCompletionConfirmedEvent.
 *
 * The handler does not calculate confirmedCount or mutate confirmation
 * entities directly.
 */
@Injectable()
export class ConfirmJourneyCompletionHandler implements CommandHandler<
  ConfirmJourneyCompletionCommand,
  JourneyCompletionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
    private readonly repository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ConfirmJourneyCompletionCommand,
  ): Promise<JourneyCompletionAggregate> {
    // -------------------------------------------------------------------------
    // Aggregate Lookup
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyCompletionPublicId,
    );

    if (aggregate === null) {
      throw new JourneyCompletionNotFoundException(
        command.journeyCompletionPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Domain Transition
    // -------------------------------------------------------------------------

    aggregate.confirm(
      command.correlationId,
      command.causationId,
      command.confirmedAt,
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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ConfirmJourneyCompletionHandler;
