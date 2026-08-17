// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandByPublicIdQuery } from '../queries/get-journey-demand-by-public-id.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandByPublicIdQueryHandler implements QueryHandler<
  GetJourneyDemandByPublicIdQuery,
  JourneyDemandAggregate
> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  async execute(
    query: GetJourneyDemandByPublicIdQuery,
  ): Promise<JourneyDemandAggregate> {
    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    return aggregate;
  }
}
