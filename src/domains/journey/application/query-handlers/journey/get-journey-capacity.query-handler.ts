// src/domains/journey/application/query-handlers/journey/get-journey-capacity.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCapacityQuery } from '../../queries/journey/get-journey-capacity.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyCapacityQueryHandler implements QueryHandler<
  GetJourneyCapacityQuery,
  JourneyCapacityEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyCapacityQuery,
  ): Promise<JourneyCapacityEntity | null> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Capacity
    //
    // Capacity belongs to the Journey aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findCapacity(aggregate.journeyId);
  }
}
