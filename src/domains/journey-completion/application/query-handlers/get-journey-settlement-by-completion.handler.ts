// -----------------------------------------------------------------------------
// Get Journey Settlement By Completion Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneySettlementByCompletionQuery } from '../queries/get-journey-settlement-by-completion.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects/journey-completion-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of the Journey Settlement associated with a
 * Journey Completion.
 *
 * Journey Settlement is a separate aggregate. The handler therefore queries
 * the Journey Settlement repository directly and does not cross aggregate
 * boundaries through the Journey Completion aggregate.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 */
export class GetJourneySettlementByCompletionHandler implements QueryHandler<
  GetJourneySettlementByCompletionQuery,
  JourneySettlementEntity | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly repository: JourneySettlementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneySettlementByCompletionQuery,
  ): Promise<JourneySettlementEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    return await this.repository.findJourneySettlementByCompletionPublicId(
      completionPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementByCompletionHandler;
