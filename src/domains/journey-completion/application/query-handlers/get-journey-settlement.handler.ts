// -----------------------------------------------------------------------------
// Get Journey Settlement Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneySettlementQuery } from '../queries/get-journey-settlement.query';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneySettlementAggregate } from '../../domain/aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import { JourneySettlementPublicId } from '../../domain/value-objects/journey-settlement-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Settlement aggregate by public identity.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 */
export class GetJourneySettlementHandler implements QueryHandler<
  GetJourneySettlementQuery,
  JourneySettlementAggregate | null
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
    query: GetJourneySettlementQuery,
  ): Promise<JourneySettlementAggregate | null> {
    const journeySettlementPublicId = new JourneySettlementPublicId(
      query.journeySettlementPublicId,
    );

    return await this.repository.findByPublicId(journeySettlementPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementHandler;
