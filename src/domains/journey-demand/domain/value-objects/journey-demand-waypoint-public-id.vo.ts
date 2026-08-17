// -----------------------------------------------------------------------------
// Journey Demand Waypoint Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Waypoint.
 */
export class JourneyDemandWaypointPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDW');
  }
}
