// -----------------------------------------------------------------------------
// Journey Completion — Request Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RequestJourneyCompletionCommand } from '../commands/request-journey-completion.command';

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
 * Handles a Journey Completion request.
 *
 * The handler is responsible only for application-level orchestration:
 *
 * 1. Locate the Journey Completion aggregate.
 * 2. Fail explicitly when the aggregate does not exist.
 * 3. Delegate the lifecycle transition to the aggregate.
 * 4. Persist the changed aggregate.
 * 5. Return the updated aggregate.
 *
 * JourneyCompletionAggregate.request() owns all lifecycle rules and records
 * JourneyCompletionRequestedEvent.
 */
@Injectable()
export class RequestJourneyCompletionHandler implements CommandHandler<
  RequestJourneyCompletionCommand,
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
    command: RequestJourneyCompletionCommand,
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

    aggregate.request(
      command.correlationId,
      command.causationId,
      command.requestedAt,
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

export default RequestJourneyCompletionHandler;
