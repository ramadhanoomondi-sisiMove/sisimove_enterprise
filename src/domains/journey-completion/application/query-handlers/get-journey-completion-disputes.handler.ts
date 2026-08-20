// -----------------------------------------------------------------------------
// Get Journey Completion Disputes Query Handler
// -----------------------------------------------------------------------------

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Completion disputes.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 *
 * The handler delegates persistence-specific lookup to the repository while
 * preserving the domain value-object boundary.
 */
export class GetJourneyCompletionDisputesHandler implements QueryHandler<
  GetJourneyCompletionDisputesQuery,
  JourneyCompletionDisputeEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
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
    //
    // The repository's status/reason/raised-by queries are scoped by the
    // internal Journey Completion ID. Resolve the aggregate first so the
    // child queries can use its internal aggregate identity.
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

      return await this.repository.findDisputesByRaisedByPublicId(
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

      return await this.repository.findDisputesByReason(
        aggregate.aggregateId,
        reason,
      );
    }

    // -------------------------------------------------------------------------
    // All disputes
    // -------------------------------------------------------------------------

    return await this.repository.findDisputes(aggregate.aggregateId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputesHandler;
