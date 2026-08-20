// -----------------------------------------------------------------------------
// Journey Completion — Cancel Command Handler
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

import type { CancelJourneyCompletionCommand } from '../commands/cancel-journey-completion.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyCompletionNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles cancelling a Journey Completion.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Completion aggregate.
 * 2. Delegate cancellation to the aggregate.
 * 3. Persist the modified aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate remains responsible for:
 *
 * - validating the current lifecycle state;
 * - determining whether cancellation is permitted;
 * - applying the cancellation;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionCancelledEvent.
 *
 * The handler does not directly mutate the Journey Completion entity.
 */
@Injectable()
export class CancelJourneyCompletionHandler implements CommandHandler<
  CancelJourneyCompletionCommand,
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
    command: CancelJourneyCompletionCommand,
  ): Promise<JourneyCompletionAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
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
    // Domain Operation
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt,
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

export default CancelJourneyCompletionHandler;
