// src/domains/journey-demand/application/handlers/get-journey-demand-capacity.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandCapacityQuery } from '../queries/get-journey-demand-capacity.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacityEntity } from '../../domain/entities/journey-demand-capacity.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandCapacityQueryHandler implements QueryHandler<
  GetJourneyDemandCapacityQuery,
  JourneyDemandCapacityEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandCapacityQuery,
  ): Promise<JourneyDemandCapacityEntity> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Validate Journey Demand
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Load Capacity
    //
    // JourneyDemandAggregate exposes its internal identity through aggregateId.
    // Do not access a non-existent journeyDemandId property.
    // -------------------------------------------------------------------------

    const capacity = await this.repository.findCapacity(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Capacity
    // -------------------------------------------------------------------------

    if (capacity === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return capacity;
  }
}
