// src/domains/journey-demand/application/handlers/get-journey-demand-corridor.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandCorridorQuery } from '../queries/get-journey-demand-corridor.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorEntity } from '../../domain/entities/journey-demand-corridor.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandCorridorQueryHandler implements QueryHandler<
  GetJourneyDemandCorridorQuery,
  JourneyDemandCorridorEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandCorridorQuery,
  ): Promise<JourneyDemandCorridorEntity> {
    // -------------------------------------------------------------------------
    // Load Journey Demand Aggregate
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
    // Load Corridor
    //
    // JourneyDemandAggregate exposes the aggregate's internal identity through
    // aggregateId. There is intentionally no journeyDemandId property on the
    // aggregate.
    // -------------------------------------------------------------------------

    const corridor = await this.repository.findCorridor(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Corridor
    // -------------------------------------------------------------------------

    if (corridor === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return corridor;
  }
}
