// src/domains/journey/application/query-handlers/journey/get-journey-waypoint.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyWaypointQuery } from '../../queries/journey/get-journey-waypoint.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyWaypointQueryHandler implements QueryHandler<
  GetJourneyWaypointQuery,
  JourneyWaypointEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyWaypointQuery,
  ): Promise<JourneyWaypointEntity | null> {
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
    // Resolve Waypoint
    //
    // Waypoints belong to the Journey corridor and are therefore resolved
    // within the Journey aggregate boundary.
    // -------------------------------------------------------------------------

    return this.repository.findWaypointByPublicId(
      aggregate.journeyId,
      query.waypointPublicId,
    );
  }
}
