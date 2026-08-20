// -----------------------------------------------------------------------------
// Journey Completion — Resolve Dispute Command Handler
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

import type { ResolveJourneyCompletionDisputeCommand } from '../commands/resolve-journey-completion-dispute.command';

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
 * Handles resolving a Journey Completion dispute.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Completion aggregate.
 * 2. Delegate dispute resolution to the aggregate.
 * 3. Persist the modified aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate remains responsible for:
 *
 * - locating the dispute;
 * - validating the dispute lifecycle;
 * - validating the resolver;
 * - validating the resolution summary;
 * - resolving the dispute;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionDisputeResolvedEvent.
 *
 * The handler does not directly mutate the dispute entity.
 */
@Injectable()
export class ResolveJourneyCompletionDisputeHandler implements CommandHandler<
  ResolveJourneyCompletionDisputeCommand,
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
    command: ResolveJourneyCompletionDisputeCommand,
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

    aggregate.resolveDispute(
      command.disputePublicId,
      command.resolvedByPublicId,
      command.resolutionSummary,
      command.correlationId,
      command.causationId,
      command.resolvedAt,
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

export default ResolveJourneyCompletionDisputeHandler;
