// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyWaypointsQuery } from '../../queries/journey/get-journey-waypoints.query';

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

export class GetJourneyWaypointsQueryHandler implements QueryHandler<
  GetJourneyWaypointsQuery,
  JourneyWaypointEntity[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyWaypointsQuery,
  ): Promise<JourneyWaypointEntity[]> {
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
    // Resolve Waypoints
    //
    // Waypoints are owned by the Journey aggregate.
    // The repository expects the internal JourneyId.
    // -------------------------------------------------------------------------

    return this.repository.findWaypoints(aggregate.journeyId);
  }
}
