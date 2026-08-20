// src/domains/journey-completion/application/command-handlers/review-journey-completion-dispute.handler.ts

// -----------------------------------------------------------------------------
// Journey Completion — Review Dispute Command Handler
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

import type { ReviewJourneyCompletionDisputeCommand } from '../commands/review-journey-completion-dispute.command';

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

import { JourneyCompletionDisputeNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles placing an OPEN Journey Completion dispute UNDER_REVIEW.
 *
 * Application responsibilities:
 *
 * 1. Load the owning Journey Completion aggregate.
 * 2. Delegate the dispute lifecycle transition to the aggregate.
 * 3. Persist the modified aggregate.
 * 4. Return the updated aggregate.
 *
 * The aggregate remains responsible for:
 *
 * - locating the dispute;
 * - validating the dispute lifecycle;
 * - enforcing domain invariants;
 * - changing the dispute state;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionDisputeUnderReviewEvent.
 */
@Injectable()
export class ReviewJourneyCompletionDisputeHandler implements CommandHandler<
  ReviewJourneyCompletionDisputeCommand,
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
    command: ReviewJourneyCompletionDisputeCommand,
  ): Promise<JourneyCompletionAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    /**
     * The dispute public ID identifies a child entity inside the
     * Journey Completion aggregate.
     *
     * The repository resolves the owning aggregate before the domain
     * operation is invoked.
     */
    const aggregate = await this.repository.findByDisputePublicId(
      command.disputePublicId,
    );

    if (aggregate === null) {
      throw new JourneyCompletionDisputeNotFoundException(
        command.disputePublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Domain Operation
    // -------------------------------------------------------------------------

    /**
     * The aggregate is the sole authority for the dispute transition.
     */
    aggregate.putDisputeUnderReview(
      command.disputePublicId,
      command.correlationId,
      command.causationId,
      command.underReviewAt,
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

export default ReviewJourneyCompletionDisputeHandler;
