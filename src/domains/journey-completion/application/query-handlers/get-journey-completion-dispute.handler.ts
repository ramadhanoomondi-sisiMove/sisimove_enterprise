// -----------------------------------------------------------------------------
// Get Journey Completion Dispute Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Receive a query for a specific Journey Completion dispute.
// 2. Construct the owning Journey Completion public ID.
// 3. Construct the dispute public ID.
// 4. Retrieve the dispute through the Journey Completion repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected through JOURNEY_COMPLETION_TOKENS.REPOSITORY.
// - Both public identities are used to resolve the dispute within its
//   owning Journey Completion.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCompletionDisputeQuery } from '../queries/get-journey-completion-dispute.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneyCompletionDisputeEntity } from '../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects/journey-completion-public-id.vo';

import { JourneyCompletionDisputePublicId } from '../../domain/value-objects/journey-completion-dispute-public-id.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a single Journey Completion dispute.
 *
 * NestJS injects the repository through the registered repository token.
 */
@Injectable()
export class GetJourneyCompletionDisputeHandler implements QueryHandler<
  GetJourneyCompletionDisputeQuery,
  JourneyCompletionDisputeEntity | null
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
    query: GetJourneyCompletionDisputeQuery,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    const disputePublicId = new JourneyCompletionDisputePublicId(
      query.disputePublicId,
    );

    return this.repository.findDisputeByCompletionPublicId(
      completionPublicId,
      disputePublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputeHandler;
