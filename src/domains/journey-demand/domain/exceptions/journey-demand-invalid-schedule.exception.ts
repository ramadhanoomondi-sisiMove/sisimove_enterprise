// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidScheduleException extends JourneyDemandException {
  constructor(message: string = 'Journey demand schedule is invalid.') {
    super(message);
  }
}
