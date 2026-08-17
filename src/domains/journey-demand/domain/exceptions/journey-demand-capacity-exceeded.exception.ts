// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandCapacityExceededException extends JourneyDemandException {
  constructor(message: string = 'Journey demand capacity has been exceeded.') {
    super(message);
  }
}
