// -----------------------------------------------------------------------------
// Get Journey Completion Dispute Query Handler
// -----------------------------------------------------------------------------

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a single Journey Completion dispute.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 */
export class GetJourneyCompletionDisputeHandler implements QueryHandler<
  GetJourneyCompletionDisputeQuery,
  JourneyCompletionDisputeEntity | null
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
    query: GetJourneyCompletionDisputeQuery,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    const disputePublicId = new JourneyCompletionDisputePublicId(
      query.disputePublicId,
    );

    return await this.repository.findDisputeByCompletionPublicId(
      completionPublicId,
      disputePublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputeHandler;
