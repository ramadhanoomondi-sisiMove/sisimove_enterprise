// src/domains/journey-demand/application/handlers/get-my-journey-demands.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetMyJourneyDemandsQuery } from '../queries/get-my-journey-demands.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetMyJourneyDemandsQueryHandler implements QueryHandler<
  GetMyJourneyDemandsQuery,
  JourneyDemandEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetMyJourneyDemandsQuery,
  ): Promise<JourneyDemandEntity[]> {
    // -------------------------------------------------------------------------
    // Load Journey Demands belonging to requester
    // -------------------------------------------------------------------------

    const demands = await this.repository.findJourneyDemandsByRequesterPublicId(
      query.requesterPublicId,
    );

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------

    const offset = Math.max(0, query.offset ?? 0);

    if (query.limit === undefined) {
      return demands.slice(offset);
    }

    const limit = Math.max(0, query.limit);

    return demands.slice(offset, offset + limit);
  }
}
