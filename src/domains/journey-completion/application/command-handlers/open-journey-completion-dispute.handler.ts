// -----------------------------------------------------------------------------
// Journey Completion — Open Dispute Command Handler
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

import type { OpenJourneyCompletionDisputeCommand } from '../commands/open-journey-completion-dispute.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyCompletionDisputeEntity } from '../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionDisputePublicId,
  JourneyCompletionDisputeStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyCompletionNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles opening a Journey Completion dispute.
 *
 * Application responsibilities:
 *
 * 1. Load the Journey Completion aggregate.
 * 2. Generate the dispute public identity.
 * 3. Create the dispute entity in OPEN state.
 * 4. Delegate all business rules to the aggregate.
 * 5. Persist the aggregate.
 * 6. Return the updated aggregate.
 *
 * The repository is resolved through the Journey Completion repository token.
 */
@Injectable()
export class OpenJourneyCompletionDisputeHandler implements CommandHandler<
  OpenJourneyCompletionDisputeCommand,
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
    command: OpenJourneyCompletionDisputeCommand,
  ): Promise<JourneyCompletionAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.completionPublicId,
    );

    if (aggregate === null) {
      throw new JourneyCompletionNotFoundException(
        command.completionPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Dispute Public Identity
    // -------------------------------------------------------------------------

    const disputePublicId = new JourneyCompletionDisputePublicId();

    // -------------------------------------------------------------------------
    // Dispute Entity
    // -------------------------------------------------------------------------

    /**
     * A newly opened dispute must begin in OPEN state.
     *
     * The aggregate remains responsible for determining whether the
     * completion may actually be disputed and whether another active
     * dispute already exists.
     */
    const dispute = JourneyCompletionDisputeEntity.create({
      publicId: disputePublicId,

      completionId: aggregate.publicId,

      raisedByPublicId: command.raisedByPublicId,

      reason: command.reason,

      ...(command.description !== undefined
        ? { description: command.description }
        : {}),

      status: JourneyCompletionDisputeStatus.open(),

      openedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    /**
     * JourneyCompletionAggregate.dispute() owns the authoritative business
     * rules for opening the dispute.
     */
    aggregate.dispute(dispute, command.correlationId, command.causationId);

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

export default OpenJourneyCompletionDisputeHandler;
