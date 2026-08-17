// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandQuery } from '../queries/get-journey-demand.query';

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

export class GetJourneyDemandQueryHandler implements QueryHandler<
  GetJourneyDemandQuery,
  JourneyDemandAggregate
> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  async execute(query: GetJourneyDemandQuery): Promise<JourneyDemandAggregate> {
    const aggregate = await this.repository.findById(query.journeyDemandId);

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    return aggregate;
  }
}
