// src/domains/journey/domain/exceptions/journey-invalid-waypoint.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Waypoint
// -----------------------------------------------------------------------------

export class JourneyInvalidWaypointException extends JourneyException {
  constructor(message: string = 'Journey waypoint is invalid.') {
    super(message);
  }
}
