// src/domains/journey/application/queries/journey/get-journey-waypoint.query.ts

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyWaypointPublicId } from '../../../domain/value-objects/journey-waypoint-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyWaypointQuery {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Public identifier of the Journey waypoint.
     */
    public readonly waypointPublicId: JourneyWaypointPublicId,
  ) {}
}
