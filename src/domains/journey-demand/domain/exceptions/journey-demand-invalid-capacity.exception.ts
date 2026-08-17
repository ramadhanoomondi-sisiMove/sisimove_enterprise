// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidCapacityException extends JourneyDemandException {
  constructor(message: string = 'Journey demand capacity is invalid.') {
    super(message);
  }
}
