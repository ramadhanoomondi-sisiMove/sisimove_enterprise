// -----------------------------------------------------------------------------
// Get Journey Completion Disputes Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve disputes belonging to a specific Journey Completion.
// 2. Support filtering by the member who raised a dispute.
// 3. Support filtering by dispute status and reason.
// 4. Resolve the owning aggregate before querying its disputes.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected through JOURNEY_COMPLETION_TOKENS.REPOSITORY.
// - Existing repository methods and domain value objects are preserved.
// - Disputes remain scoped to their owning Journey Completion aggregate.
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

import type { GetJourneyCompletionDisputesQuery } from '../queries/get-journey-completion-disputes.query';

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

import { JourneyCompletionMemberPublicId } from '../../domain/value-objects/journey-completion-member-public-id.vo';

import { JourneyCompletionDisputeStatus } from '../../domain/value-objects/journey-completion-dispute-status.vo';

import { JourneyCompletionDisputeReason } from '../../domain/value-objects/journey-completion-dispute-reason.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Completion disputes.
 *
 * NestJS injects the repository through the registered repository token.
 *
 * Persistence-specific lookup is delegated to the repository while domain
 * filtering uses the appropriate value objects.
 */
@Injectable()
export class GetJourneyCompletionDisputesHandler implements QueryHandler<
  GetJourneyCompletionDisputesQuery,
  JourneyCompletionDisputeEntity[]
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
    query: GetJourneyCompletionDisputesQuery,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    // -------------------------------------------------------------------------
    // Resolve owning Journey Completion aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(completionPublicId);

    if (aggregate === null) {
      return [];
    }

    // -------------------------------------------------------------------------
    // Raised By
    // -------------------------------------------------------------------------

    if (query.raisedByPublicId !== undefined) {
      const raisedByPublicId = new JourneyCompletionMemberPublicId(
        query.raisedByPublicId,
      );

      return this.repository.findDisputesByRaisedByPublicId(
        aggregate.aggregateId,
        raisedByPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    if (query.status !== undefined) {
      const status = JourneyCompletionDisputeStatus.create(query.status);

      const disputes = await this.repository.findDisputesByStatus(
        aggregate.aggregateId,
        status,
      );

      if (query.reason === undefined) {
        return disputes;
      }

      const reason = JourneyCompletionDisputeReason.create(query.reason);

      return disputes.filter((dispute) => dispute.reason.equals(reason));
    }

    // -------------------------------------------------------------------------
    // Reason
    // -------------------------------------------------------------------------

    if (query.reason !== undefined) {
      const reason = JourneyCompletionDisputeReason.create(query.reason);

      return this.repository.findDisputesByReason(
        aggregate.aggregateId,
        reason,
      );
    }

    // -------------------------------------------------------------------------
    // All disputes
    // -------------------------------------------------------------------------

    return this.repository.findDisputes(aggregate.aggregateId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputesHandler;
