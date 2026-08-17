// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidWaypointException extends JourneyDemandException {
  constructor(message: string = 'Journey demand waypoint is invalid.') {
    super(message);
  }
}
